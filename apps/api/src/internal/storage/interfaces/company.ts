import type {
  Company,
  CreateCompanyParams,
  CreatePlaidCredentialParams,
  PlaidCredential,
  QuickBooksOauthCredential,
  CreateQuickBooksOauthStateParams,
  QuickBooksOauthState,
  UpdateQuickBooksOauthCredentialParams,
  CreateQuickBooksOauthCredentialParams,
} from "@fundlevel/db/types";

export enum SyncJobType {
  QUICKBOOKS_INVOICES = "QUICKBOOKS_INVOICES",
  QUICKBOOKS_ACCOUNTS = "QUICKBOOKS_ACCOUNTS",
  QUICKBOOKS_CREDIT_NOTES = "QUICKBOOKS_CREDIT_NOTES",
  QUICKBOOKS_JOURNAL_ENTRIES = "QUICKBOOKS_JOURNAL_ENTRIES",
  QUICKBOOKS_PAYMENTS = "QUICKBOOKS_PAYMENTS",
  QUICKBOOKS_TRANSACTIONS = "QUICKBOOKS_TRANSACTIONS",
  QUICKBOOKS_VENDOR_CREDITS = "QUICKBOOKS_VENDOR_CREDITS",
  PLAID_BANK_ACCOUNTS = "PLAID_BANK_ACCOUNTS",
  PLAID_TRANSACTIONS = "PLAID_TRANSACTIONS",
}

export interface ICompanyRepository {
  create(account: CreateCompanyParams, ownerId: number): Promise<Company>;
  getById(id: number): Promise<Company>;
  getByAccountId(accountId: number): Promise<Company[]>;
  searchCompanies(query: string, accountId: number): Promise<Company[]>;
  updateLastSyncedAt(type: SyncJobType, companyId: number): Promise<Company>;

  createPlaidCredentials(
    params: CreatePlaidCredentialParams,
    companyId: number,
  ): Promise<PlaidCredential>;
  deletePlaidCredentials(companyId: number): Promise<void>;
  getPlaidCredentialsByItemId(itemId: string): Promise<PlaidCredential>;
  getPlaidCredentialsByCompanyId(companyId: number): Promise<PlaidCredential>;
  updateTransactionCursor(companyId: number, cursor: string): Promise<void>;
  deleteCompany(id: number): Promise<void>;

  getQuickBooksOAuthCredentials(
    companyId: number,
  ): Promise<QuickBooksOauthCredential>;
  getCompanyByQuickBooksRealmId(realmId: string): Promise<Company | undefined>;
  updateQuickBooksOAuthCredentials(
    params: UpdateQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<QuickBooksOauthCredential>;
  deleteQuickBooksOAuthCredentials(companyId: number): Promise<void>;
  createQuickBooksOAuthCredentials(
    params: CreateQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<QuickBooksOauthCredential>;

  getQuickBooksOauthState(state: string): Promise<QuickBooksOauthState>;
  deleteQuickBooksOauthStates(companyId: number): Promise<void>;
  createQuickBooksOauthState(
    params: CreateQuickBooksOauthStateParams,
    companyId: number,
  ): Promise<void>;
}
