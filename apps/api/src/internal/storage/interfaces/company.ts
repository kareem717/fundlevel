import type {
  Company,
  CreateCompany,
  CreatePlaidCredentials,
  PlaidCredentials,
  QuickBooksOAuthCredentials,
  CreateQuickBooksOAuthState,
  QuickBooksOAuthState,
  UpdateQuickBooksOAuthCredentials,
  CreateQuickBooksOAuthCredentials,
} from "../../entities";

export interface ICompanyRepository {
  create(account: CreateCompany): Promise<Company>;
  getById(id: number): Promise<Company>;
  getByAccountId(accountId: number): Promise<Company[]>;

  createPlaidCredentials(params: CreatePlaidCredentials): Promise<PlaidCredentials>;
  deletePlaidCredentials(companyId: number): Promise<void>;
  getPlaidCredentialsByItemId(itemId: string): Promise<PlaidCredentials>;
  updateTransactionCursor(companyId: number, cursor: string): Promise<void>;
  deleteCompany(id: number): Promise<void>;


  getQuickBooksOAuthCredentials(companyId: number): Promise<QuickBooksOAuthCredentials>;
  updateQuickBooksOAuthCredentials(params: UpdateQuickBooksOAuthCredentials, companyId: number): Promise<QuickBooksOAuthCredentials>;
  deleteQuickBooksOAuthCredentials(companyId: number): Promise<void>;
  createQuickBooksOAuthCredentials(params: CreateQuickBooksOAuthCredentials, companyId: number): Promise<void>;

  getQuickBooksOAuthState(state: string): Promise<QuickBooksOAuthState>;
  deleteQuickBooksOAuthStates(companyId: number): Promise<void>;
  createQuickBooksOAuthState(params: CreateQuickBooksOAuthState, companyId: number): Promise<void>;
}
