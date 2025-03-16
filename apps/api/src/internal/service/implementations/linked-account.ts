import type { ILinkedAccountService } from "../interfaces";
import type { ILinkedAccountRepository } from "../../storage";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  CountryCode,
  Products,
} from "plaid";
import type { CreateLinkedAccount, LinkedAccount } from "../../entities";
import { env } from "../../../env";
import { randomUUIDv7 } from "bun";
import axios from "axios";

export class LinkedAccountService implements ILinkedAccountService {
  private plaid;
  private linkedAccountRepo;

  private qbApiBaseUrl: string;
  private static qbStateExpiresInMs = 60 * 5 * 1000; // 5 minutes;

  private static QUICK_BOOKS_OAUTH_SCOPES = "com.intuit.quickbooks.accounting";
  private static readonly QUICK_BOOKS_OAUTH_BASE_URL =
    "https://appcenter.intuit.com/connect/oauth2";
  private static readonly QUICK_BOOKS_OAUTH_TOKEN_URL =
    "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
  private static readonly QUICK_BOOKS_OAUTH_REVOKE_URL =
    "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

  constructor(linkedAccountRepo: ILinkedAccountRepository) {
    this.linkedAccountRepo = linkedAccountRepo;

    // Set the appropriate base URLs based on environment
    switch (env.QB_ENVIRONMENT) {
      case "sandbox":
        this.qbApiBaseUrl = "https://sandbox-quickbooks.api.intuit.com";
        break;
      default:
        this.qbApiBaseUrl = "https://quickbooks.api.intuit.com";
        break;
    }

    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[env.PLAID_ENVIRONMENT],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
          "PLAID-SECRET": env.PLAID_SECRET,
        },
      },
    });

    this.plaid = new PlaidApi(plaidConfig);
    this.linkedAccountRepo = linkedAccountRepo;
  }

  async createPlaidLinkToken({
    linkedAccountId,
  }: {
    linkedAccountId: number;
  }) {
    const resp = await this.plaid.linkTokenCreate({
      // TODO: read from config
      client_name: "Fundlevel",
      language: "en",
      country_codes: [CountryCode.Us, CountryCode.Ca],
      products: [Products.Transactions],
      user: {
        client_user_id: String(linkedAccountId),
      },
      webhook: env.PLAID_WEBHOOK_URL,
    });

    return resp.data.link_token;
  }

  async createPlaidCredentials(params: {
    linkedAccountId: number;
    publicToken: string;
  }) {
    const { item_id, access_token } = (
      await this.plaid.itemPublicTokenExchange({
        public_token: params.publicToken,
      })
    ).data;

    const creds = await this.linkedAccountRepo.createPlaidCredentials({
      linked_account_id: params.linkedAccountId,
      item_id,
      access_token,
    });

    return creds;
  }

  async getById(id: number) {
    return this.linkedAccountRepo.getById(id);
  }

  async getByAccountId(accountId: number) {
    return this.linkedAccountRepo.getByAccountId(accountId);
  }

  async create(params: CreateLinkedAccount): Promise<LinkedAccount> {
    return this.linkedAccountRepo.create(params);
  }

  async deletePlaidCredentials(linkedAccountId: number): Promise<void> {
    await this.linkedAccountRepo.deletePlaidCredentials(linkedAccountId);
  }

  async deleteLinkedAccount(id: number): Promise<void> {
    try {
      await this.linkedAccountRepo.deleteQuickBooksOAuthCredentials(id);
    } catch {
      //ignore error
    }

    await this.linkedAccountRepo.deleteLinkedAccount(id);
  }

  async startQuickBooksOAuthFlow(linkedAccountId: number, redirectUrl: string) {
    try {
      // Clear old states to avoid conflicts
      await this.linkedAccountRepo.deleteQuickBooksOAuthStates(linkedAccountId);
    } catch {
      //ignore error
    }

    const state = randomUUIDv7();

    const params = new URLSearchParams({
      client_id: env.QB_CLIENT_ID,
      response_type: "code",
      scope: LinkedAccountService.QUICK_BOOKS_OAUTH_SCOPES,
      redirect_uri: redirectUrl,
      state,
    });

    const auth_url = `${LinkedAccountService.QUICK_BOOKS_OAUTH_BASE_URL}/authorize?${params.toString()}`;

    // Save the state in the session
    await this.linkedAccountRepo.createQuickBooksOAuthState(
      {
        state,
        expires_at: new Date(
          Date.now() + LinkedAccountService.qbStateExpiresInMs,
        ).toISOString(),
        redirect_url: redirectUrl,
        auth_url,
      },
      linkedAccountId,
    );

    return auth_url;
  }

  async completeQuickBooksOAuthFlow(params: {
    code: string;
    state: string;
    realmId: string;
  }) {
    const { code, state: callbackState, realmId } = params;
    const { linked_account_id, redirect_url } = await this.linkedAccountRepo.getQuickBooksOAuthState(callbackState);

    const response = await axios.post(
      LinkedAccountService.QUICK_BOOKS_OAUTH_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect_url,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${env.PLAID_CLIENT_ID}:${env.QB_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );

    if (typeof response.data === "string") {
      throw new Error("Invalid response format from QuickBooks API");
    }

    if (!response.data.access_token || !response.data.refresh_token) {
      throw new Error(
        "Invalid response format from QuickBooks API",
        response.data,
      );
    }

    const {
      access_token,
      refresh_token,
      expires_in,
      x_refresh_token_expires_in,
    } = response.data;

    // Make direct API call using axios instead of the buggy SDK method
    const companyResponse = await axios.get(
      `${this.qbApiBaseUrl}/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      },
    );

    // Extract company info from response
    const companyInfo = companyResponse.data.CompanyInfo;
    if (!companyInfo) {
      throw new Error("Invalid response format from QuickBooks API");
    }

    await this.linkedAccountRepo.createQuickBooksOAuthCredentials(
      {
        realm_id: realmId,
        access_token: access_token,
        refresh_token: refresh_token,
        access_token_expiry: new Date(
          Date.now() + expires_in * 1000,
        ).toISOString(),
        refresh_token_expiry: new Date(
          Date.now() + x_refresh_token_expires_in * 1000,
        ).toISOString(),
      },
      linked_account_id,
    );
    // Doesn't really have to be in a tx
    await this.linkedAccountRepo.deleteQuickBooksOAuthStates(linked_account_id);

    return redirect_url;
  }

  async getQuickBooksOAuthCredentials(linkedAccountId: number) {
    const creds = await this.linkedAccountRepo.getQuickBooksOAuthCredentials(linkedAccountId);

    if (creds.access_token_expiry < new Date().toISOString()) {
      const response = await axios.post(
        LinkedAccountService.QUICK_BOOKS_OAUTH_TOKEN_URL,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: creds.refresh_token,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: `Basic ${Buffer.from(
              `${env.QB_CLIENT_ID}:${env.QB_CLIENT_SECRET}`,
            ).toString("base64")}`,
          },
        },
      );

      // Update token expiry times
      const access_token_expiry = new Date(
        Date.now() + response.data.expires_in * 1000,
      ).toISOString();
      const refresh_token_expiry = new Date(
        Date.now() + response.data.x_refresh_token_expires_in * 1000,
      ).toISOString();

      // Update the database with new token data
      const newRrcord = await this.linkedAccountRepo.updateQuickBooksOAuthCredentials(
        {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          access_token_expiry,
          refresh_token_expiry,
        },
        linkedAccountId,
      );

      // Update the return object with fresh data
      return newRrcord;
    }

    return creds;
  }

  async deleteQuickBooksOAuthCredentials(linkedAccountId: number) {
    const creds = await this.linkedAccountRepo.getQuickBooksOAuthCredentials(linkedAccountId);

    await axios.post(
      LinkedAccountService.QUICK_BOOKS_OAUTH_REVOKE_URL,
      new URLSearchParams({
        token: creds.refresh_token,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${env.QB_CLIENT_ID}:${env.QB_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );

    await this.linkedAccountRepo.deleteQuickBooksOAuthCredentials(linkedAccountId);
  }
}
