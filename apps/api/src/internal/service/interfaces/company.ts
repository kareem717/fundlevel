import type {
  CreateCompanyParams,
  Company,
  CompanyPlaidCredentials,
  CompanyQuickBooksOauthCredential,
} from "@fundlevel/db/types";

export interface ICompanyService {
  get(id: number): Promise<Company | undefined>;
  getMany(filter: { ids: number[] } | { ownerId: number }): Promise<Company[]>;
  create(params: CreateCompanyParams, ownerId: number): Promise<Company>;

  createPlaidLinkToken(companyId: number): Promise<string>;
  swapPlaidPublicToken(companyId: number, publicToken: string): Promise<CompanyPlaidCredentials>;

  getPlaidCredentials(filter: { companyId: number } | { itemId: string }): Promise<CompanyPlaidCredentials | undefined>;

  startQuickBooksOAuthFlow(
    companyId: number,
    redirectUrl: string,
  ): Promise<string>;
  getQuickBooksOAuthCredentials(
    filter: { companyId: number } | { realmId: string },
  ): Promise<CompanyQuickBooksOauthCredential>;
  completeQuickBooksOAuthFlow(code: string, state: string, realmId: string): Promise<{
    redirect_url: string;
    company_id: number;
  }>;

  syncBankAccounts(companyId: number): Promise<void>;
  syncBankTransactions(companyId: number): Promise<void>;
  syncInvoices(companyId: number): Promise<void>;
}
