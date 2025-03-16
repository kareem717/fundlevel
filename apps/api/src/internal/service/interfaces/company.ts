import type {
  CreateCompany,
  Company,
  PlaidCredentials,
  QuickBooksOAuthCredentials
} from "../../entities";

export interface ICompanieservice {
  getById(id: number): Promise<Company>;
  getByAccountId(accountId: number): Promise<Company[]>;
  create(params: CreateCompany): Promise<Company>;
  deleteCompany(id: number): Promise<void>;

  deletePlaidCredentials(companyId: number): Promise<void>;
  createPlaidLinkToken({
    companyId,
  }: {
    companyId: number;
  }): Promise<string>;
  createPlaidCredentials(params: {
    companyId: number;
    publicToken: string;
  }): Promise<PlaidCredentials>;


  startQuickBooksOAuthFlow(companyId: number, redirectUrl: string): Promise<string>
  getQuickBooksOAuthCredentials(companyId: number): Promise<QuickBooksOAuthCredentials>
  deleteQuickBooksOAuthCredentials(companyId: number): Promise<void>;
  completeQuickBooksOAuthFlow(params: {
    code: string;
    state: string;
    realmId: string;
  }): Promise<string>

}
