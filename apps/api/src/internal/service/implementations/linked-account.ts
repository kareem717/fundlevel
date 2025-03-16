import {
  Merge,
  MergeClient,
  MergeEnvironment,
} from "@mergeapi/merge-node-client";
import type { ILinkedAccountService } from "../interfaces";
import type { ILinkedAccountRepository } from "../../storage";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  CountryCode,
  Products,
} from "plaid";
import type {
  CreateLinkedAccount,
  LinkedAccount,
} from "../../entities";
import { env } from "../../../env";

export class LinkedAccountService implements ILinkedAccountService {
  private merge;
  private plaid;
  private linkedAccountRepo;

  constructor(linkedAccountRepo: ILinkedAccountRepository) {
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
    this.merge = new MergeClient({
      apiKey: env.MERGE_API_KEY,
    });

    this.linkedAccountRepo = linkedAccountRepo;
  }

  async createMergeLinkToken(params: {
    linkedAccountId: number;
    organizationEmail: string;
    organizationName: string;
  }) {
    const token = await this.merge.accounting.linkToken.create({
      endUserEmailAddress: params.organizationEmail,
      endUserOrganizationName: params.organizationName,
      endUserOriginId: params.linkedAccountId.toString(),
      categories: [Merge.accounting.CategoriesEnum.Accounting],
      linkExpiryMins: 30,
    });

    return token.linkToken;
  }

  async createMergeCredentials(params: {
    linkedAccountId: number;
    accountToken: string;
  }) {
    return await this.linkedAccountRepo.createMergeCredentials({
      linked_account_id: params.linkedAccountId,
      access_token: params.accountToken,
    });
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
    const { item_id, access_token } = (await this.plaid.itemPublicTokenExchange({
      public_token: params.publicToken,
    })).data;

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

  async deleteMergeCredentials(linkedAccountId: number): Promise<void> {
    await this.linkedAccountRepo.deleteMergeCredentials(linkedAccountId);
  }

  async deleteLinkedAccount(id: number): Promise<void> {
    await this.linkedAccountRepo.deleteLinkedAccount(id);
  }
}
