import { Storage } from "@fundlevel/api/internal/storage";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  CountryCode,
  Products,
  type Transaction,
  type RemovedTransaction,
  type TransactionCode,
} from "plaid";
import type {
  CreateCompanyParams,
  Company,
  CreateInvoiceLineParams,
  CompanyQuickBooksOauthCredential,
  CompanyPlaidCredentials,
  CreateBillLineParams,
} from "@fundlevel/db/types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import type { IDB } from "@fundlevel/api/internal/storage";
import { CompanyRepository } from "@fundlevel/api/internal/storage/implementations";
import type { ICompanyService } from "@fundlevel/api/internal/service/interfaces/company";
import type { CreateBankTransactionParams } from "@fundlevel/db/types";

export type QuickBooksConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: "sandbox" | "production";
};

export type PlaidConfig = {
  environment: "sandbox" | "production";
  clientId: string;
  secret: string;
  webhookUrl: string;
};

export class CompanyService implements ICompanyService {
  private plaid;
  private repo;
  private qbApiBaseUrl: string;
  private static qbStateExpiresInMs = 60 * 5 * 1000; // 5 minutes;
  private static QUICK_BOOKS_OAUTH_SCOPES = "com.intuit.quickbooks.accounting";
  private static readonly QUICK_BOOKS_OAUTH_BASE_URL =
    "https://appcenter.intuit.com/connect/oauth2";
  private static readonly QUICK_BOOKS_OAUTH_TOKEN_URL =
    "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
  // private static readonly QUICK_BOOKS_OAUTH_REVOKE_URL =
  //   "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

  private readonly qbConfig: QuickBooksConfig;
  private readonly plaidConfig: PlaidConfig;

  constructor(
    repo: Storage,
    plaidProps: PlaidConfig,
    qbConfig: QuickBooksConfig,
  ) {
    this.repo = repo;
    this.plaidConfig = plaidProps;
    this.qbConfig = qbConfig;

    // Set the appropriate base URLs based on environment
    switch (this.qbConfig.environment) {
      case "sandbox":
        this.qbApiBaseUrl = "https://sandbox-quickbooks.api.intuit.com";
        break;
      default:
        this.qbApiBaseUrl = "https://quickbooks.api.intuit.com";
        break;
    }

    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[this.plaidConfig.environment],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": this.plaidConfig.clientId,
          "PLAID-SECRET": this.plaidConfig.secret,
        },
      },
    });

    this.plaid = new PlaidApi(plaidConfig);
  }

  async createPlaidLinkToken(companyId: number) {
    const resp = await this.plaid.linkTokenCreate({
      // TODO: read from config
      client_name: "Fundlevel",
      language: "en",
      country_codes: [CountryCode.Us, CountryCode.Ca],
      products: [Products.Transactions],
      user: {
        client_user_id: String(companyId),
      },
      webhook: this.plaidConfig.webhookUrl,
    });

    return resp.data.link_token;
  }

  async swapPlaidPublicToken(companyId: number, publicToken: string) {
    const { item_id, access_token } = (
      await this.plaid.itemPublicTokenExchange({
        public_token: publicToken,
      })
    ).data;

    const creds = await this.repo.company.createPlaidCredentials(
      {
        itemId: item_id,
        accessToken: access_token,
      },
      companyId,
    );

    return creds;
  }

  async getPlaidCredentials(
    filter: { companyId: number } | { itemId: string },
  ): Promise<CompanyPlaidCredentials | undefined> {
    // Get company and check for Plaid item id
    const creds = await this.repo.company.getPlaidCredentials(filter);
    return creds;
  }

  async get(id: number): Promise<Company | undefined> {
    return this.repo.company.get(id);
  }

  async create(params: CreateCompanyParams, ownerId: number): Promise<Company> {
    return this.repo.company.create(params, ownerId);
  }

  async startQuickBooksOAuthFlow(companyId: number, redirectUrl: string) {
    try {
      // Clear old states to avoid conflicts
      await this.repo.company.deleteQuickBooksOauthStates(companyId);
    } catch {
      //ignore error
    }

    const state = uuidv4();

    const params = new URLSearchParams({
      client_id: this.qbConfig.clientId,
      response_type: "code",
      scope: CompanyService.QUICK_BOOKS_OAUTH_SCOPES,
      redirect_uri: this.qbConfig.redirectUri,
      state,
    });

    const auth_url = `${CompanyService.QUICK_BOOKS_OAUTH_BASE_URL}/authorize?${params.toString()}`;

    // Save the state in the session
    await this.repo.company.createQuickBooksOauthState(
      {
        state,
        expiresAt: new Date(
          Date.now() + CompanyService.qbStateExpiresInMs,
        ).toISOString(),
        redirectUrl: redirectUrl,
        authUrl: auth_url,
      },
      companyId,
    );

    return auth_url;
  }

  async completeQuickBooksOAuthFlow(
    code: string,
    state: string,
    realmId: string,
  ) {
    const { companyId, redirectUrl } =
      await this.repo.company.getQuickBooksOauthState(state);

    const response = await axios.post(
      CompanyService.QUICK_BOOKS_OAUTH_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.qbConfig.redirectUri,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.qbConfig.clientId}:${this.qbConfig.clientSecret}`,
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

    await this.repo.runInTransaction(async (db: IDB) => {
      const companyRepo = new CompanyRepository(db);
      await companyRepo.createQuickBooksOAuthCredentials(
        {
          realmId: realmId,
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpiry: new Date(
            Date.now() + expires_in * 1000,
          ).toISOString(),
          refreshTokenExpiry: new Date(
            Date.now() + x_refresh_token_expires_in * 1000,
          ).toISOString(),
        },
        companyId,
      );

      // Doesn't really have to be in a tx
      await companyRepo.deleteQuickBooksOauthStates(companyId);
    });

    return {
      redirect_url: redirectUrl,
      company_id: companyId,
    };
  }

  async getQuickBooksOAuthCredentials(
    filter: { companyId: number } | { realmId: string },
  ): Promise<CompanyQuickBooksOauthCredential> {
    const creds = await this.repo.company.getQuickBooksOAuthCredentials(filter);

    if (!creds) {
      throw new Error(
        `No QuickBooks OAuth credentials found for company ${filter}`,
      );
    }

    // Check if token is expired or about to expire in the next 5 minutes
    const now = new Date();
    const tokenExpirationDate = new Date(creds.accessTokenExpiry);
    const bufferMs = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (tokenExpirationDate.getTime() - now.getTime() < bufferMs) {
      const response = await axios.post(
        CompanyService.QUICK_BOOKS_OAUTH_TOKEN_URL,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: creds.refreshToken,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: `Basic ${Buffer.from(
              `${this.qbConfig.clientId}:${this.qbConfig.clientSecret}`,
            ).toString("base64")}`,
          },
        },
      );

      // Update token expiry times
      const accessTokenExpiry = new Date(
        Date.now() + response.data.expires_in * 1000,
      ).toISOString();
      const refreshTokenExpiry = new Date(
        Date.now() + response.data.x_refresh_token_expires_in * 1000,
      ).toISOString();

      // Update the database with new token data
      const newRecord =
        await this.repo.company.updateQuickBooksOAuthCredentials(
          {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            accessTokenExpiry,
            refreshTokenExpiry,
          },
          creds.companyId,
        );

      // Update the return object with fresh data
      return newRecord;
    }

    return creds;
  }

  async syncInvoices(companyId: number) {
    const response = await this.queryQuickbooks(
      companyId,
      "SELECT * FROM Invoice",
    );

    const invoices = response.Invoice || [];
    if (!invoices.length) {
      return;
    }

    // Store in database
    await this.repo.runInTransaction(async (db: IDB) => {
      const repo = new Storage(db);

      invoices.map(async (unparsedInvoice: any) => {
        const {
          Id,
          SyncToken,
          TotalAmt,
          Balance,
          DueDate,
          CurrencyRef: { value: currencyCode, ...currencyRef } = {},
          ...invoice
        } = unparsedInvoice;

        const [newInvoice] = await repo.invoice.upsert(
          [
            {
              remoteId: Id,
              syncToken: SyncToken,
              totalAmount: TotalAmt,
              balanceRemaining: Balance,
              dueDate: DueDate,
              currency: currencyCode,
              remainingRemoteContent: JSON.stringify({
                ...invoice,
                CurrencyRef: currencyRef,
              }),
              dataProvider: "quickbooks",
            },
          ],
          companyId,
        );

        if (!newInvoice) {
          console.error("No invoice found for invoice", unparsedInvoice);
          throw new Error("No invoice found for invoice");
        }

        const lineParams: CreateInvoiceLineParams[] = invoice.Line.map(
          (line: any) => {
            let lineType: any;

            switch (line.DetailType) {
              case "SalesItemLineDetail":
                lineType = "sales_item";
                break;
              case "GroupLineDetail":
                lineType = "group";
                break;
              case "DescriptionOnly":
                lineType = "description_only";
                break;
              case "DiscountLineDetail":
                lineType = "discount";
                break;
              case "SubTotalLineDetail":
                lineType = "sub_total";
                break;
              default:
                throw new Error(`Unknown line type: ${line.DetailType}`);
            }

            return {
              amount: line.Amount,
              detailType: lineType,
              description: line.Description,
              details: line[line.DetailType],
              lineNumber: line.LineNum,
              remoteId: line.Id,
              invoiceId: newInvoice.id,
            };
          },
        );

        try {
          await repo.invoice.upsertLine(lineParams);
        } catch (error) {
          console.error(error);
          throw new Error(`Error upserting line: ${error}`);
        }
      });

      await repo.company.updateSyncStatus(
        {
          invoicesLastSyncedAt: new Date().toISOString(),
        },
        companyId,
      );
    });
  }

  async syncBills(companyId: number) {
    const response = await this.queryQuickbooks(
      companyId,
      "SELECT * FROM Bill",
    );

    const bills = response.Bill || [];
    if (!bills.length) {
      return;
    }

    // Store in database
    await this.repo.runInTransaction(async (db: IDB) => {
      const repo = new Storage(db);

      bills.map(async (unparsedBill: any) => {
        const {
          Id,
          SyncToken,
          TotalAmt,
          Balance,
          DueDate,
          CurrencyRef: { value: currencyCode, ...currencyRef } = {},
          VendorRef: { name: vendorName, ...vendorRef } = {},
          TxnDate: transactionDate,
          ...bill
        } = unparsedBill;

        const [newBill] = await repo.bill.upsert(
          [
            {
              remoteId: Id,
              syncToken: SyncToken,
              totalAmount: TotalAmt,
              remainingBalance: Balance,
              dueDate: DueDate,
              currency: currencyCode,
              vendorName: vendorName,
              transactionDate: transactionDate,
              remainingRemoteContent: JSON.stringify({
                ...bill,
                CurrencyRef: currencyRef,
                VendorRef: vendorRef,
              }),

              dataProvider: "quickbooks",
            },
          ],
          companyId,
        );

        if (!newBill) {
          console.error("No bill found for bill", unparsedBill);
          throw new Error("No bill found for bill");
        }

        const lineParams: CreateBillLineParams[] = bill.Line.map(
          (line: any) => {
            let lineType: any;

            switch (line.DetailType) {
              case "SalesItemLineDetail":
                lineType = "sales_item";
                break;
              case "GroupLineDetail":
                lineType = "group";
                break;
              case "DescriptionOnly":
                lineType = "description_only";
                break;
              case "DiscountLineDetail":
                lineType = "discount";
                break;
              case "SubTotalLineDetail":
                lineType = "sub_total";
                break;
              default:
                throw new Error(`Unknown line type: ${line.DetailType}`);
            }

            return {
              amount: line.Amount,
              description: line.Description,
              remainingRemoteContent: JSON.stringify(line),
            };
          },
        );

        try {
          await repo.bill.upsertLine(lineParams);
        } catch (error) {
          console.error(error);
          throw new Error(`Error upserting line: ${error}`);
        }
      });

      await repo.company.updateSyncStatus(
        {
          billsLastSyncedAt: new Date().toISOString(),
        },
        companyId,
      );
    });
  }

  async syncBankAccounts(companyId: number): Promise<void> {
    // Get all Plaid items for this company
    const creds = await this.repo.company.getPlaidCredentials({ companyId });
    if (!creds) {
      throw new Error(
        `Plaid credentials with companyId ${companyId} not found`,
      );
    }

    // Call the Plaid API to get accounts
    const accountsResponse = await this.plaid.accountsGet({
      access_token: creds.accessToken,
    });

    if (!accountsResponse?.data?.accounts?.length) {
      throw new Error(`No accounts found for company ${companyId}`);
    }

    // Process the accounts
    const accounts = accountsResponse.data.accounts;
    // TODO: add properties to the account object
    const bankAccountParams = accounts.map((account) => ({
      name: account.name,
      type: account.type,
      plaidAccountId: account.account_id,
      remoteId: account.account_id,
      remainingRemoteContent: JSON.stringify(account),
      isoCurrencyCode: account.balances.iso_currency_code,
      unofficialCurrencyCode: account.balances.unofficial_currency_code,
      mask: account.mask,
      subtype: account.subtype,
      officialName: account.official_name,
      availableBalance: account.balances.available,
      currentBalance: account.balances.current,
    }));

    // Store in database
    await this.repo.runInTransaction(async (db: IDB) => {
      const repo = new Storage(db);
      if (bankAccountParams.length > 0) {
        try {
          await repo.bankAccount.upsertMany(bankAccountParams, companyId);
        } catch (error) {
          console.error(error);
          throw new Error(`Error upserting bank accounts: ${error}`);
        }
      }

      try {
        await repo.company.updateSyncStatus(
          {
            bankAccountsLastSyncedAt: new Date().toISOString(),
          },
          companyId,
        );
      } catch (error) {
        console.error(error);
        throw new Error(`Error updating sync status: ${error}`);
      }
    });
  }

  async syncBankTransactions(companyId: number): Promise<void> {
    const creds = await this.repo.company.getPlaidCredentials({ companyId });
    if (!creds) {
      throw new Error(
        `Plaid credentials with companyId ${companyId} not found`,
      );
    }

    let cursor = creds.transactionCursor ?? undefined;

    // New transaction updates since "cursor"
    let upsert: Array<Transaction> = [];
    let remove: Array<RemovedTransaction> = [];
    let hasMore = true;

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await this.plaid.transactionsSync({
        access_token: creds.accessToken,
        cursor,
      });
      const data = response.data;

      // Add this page of results
      upsert = upsert.concat(data.added, data.modified);
      remove = remove.concat(data.removed);

      hasMore = data.has_more;

      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }

    const convertedUpsert: CreateBankTransactionParams[] = upsert.map((t) => {
      const {
        transaction_id,
        account_id,
        personal_finance_category,
        name,
        iso_currency_code,
        unofficial_currency_code,
        check_number,
        merchant_name,
        datetime,
        pending,
        original_description,
        authorized_datetime,
        date,
        website,
        amount,
        payment_channel,
        transaction_code,
        ...rest
      } = t;

      const remaining_remote_content = JSON.stringify({
        ...rest,
      });
      return {
        remoteId: transaction_id,
        bankAccountRemoteId: account_id,
        personalFinanceCategoryConfidenceLevel:
          personal_finance_category?.confidence_level as
            | "VERY_HIGH"
            | "HIGH"
            | "MEDIUM"
            | "LOW"
            | "UNKNOWN"
            | undefined,
        personalFinanceCategoryPrimary: personal_finance_category?.primary,
        personalFinanceCategoryDetailed: personal_finance_category?.detailed,
        remainingRemoteContent: remaining_remote_content,
        isoCurrencyCode: iso_currency_code,
        unofficialCurrencyCode: unofficial_currency_code,
        checkNumber: check_number,
        date,
        datetime,
        name,
        merchantName: merchant_name,
        website,
        authorizedAt: authorized_datetime,
        originalDescription: original_description,
        pending,
        amount,
        code: transaction_code as TransactionCode,
        paymentChannel: payment_channel,
      };
    });

    await this.repo.runInTransaction(async (db: IDB) => {
      const repo = new Storage(db);

      if (convertedUpsert.length > 0) {
        try {
          await repo.bankTransaction.upsertMany(convertedUpsert, companyId);
        } catch (error) {
          console.error(error);
          throw new Error(`Error upserting bank transactions: ${error}`);
        }
      }

      if (remove.length > 0) {
        try {
          await repo.bankTransaction.deleteMany(
            remove.map((r) => r.transaction_id),
          );
        } catch (error) {
          console.error(error);
          throw new Error(`Error deleting bank transactions: ${error}`);
        }
      }

      if (cursor) {
        try {
          await repo.company.updatePlaidTransactionCursor(companyId, cursor);
        } catch (error) {
          console.error(error);
          throw new Error(`Error updating plaid transaction cursor: ${error}`);
        }
      }
    });
  }

  async getMany(
    filter: { ids: number[] } | { ownerId: number },
  ): Promise<Company[]> {
    return this.repo.company.getMany(filter);
  }

  private async queryQuickbooks(companyId: number, query: string) {
    const credentials = await this.getQuickBooksOAuthCredentials({ companyId });

    const response = await axios.get(
      `${this.qbApiBaseUrl}/v3/company/${credentials.realmId}/query`,
      {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          Accept: "application/json",
        },
        params: {
          query,
          minorversion: 65,
        },
      },
    );

    if (!response.data?.QueryResponse) {
      throw new Error(
        `No QueryResponse from QuickBooks query for company ${companyId} and statement "${query}"`,
      );
    }

    return response.data.QueryResponse;
  }
}
