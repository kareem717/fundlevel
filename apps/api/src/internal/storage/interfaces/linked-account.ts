import type {
  LinkedAccount,
  CreateLinkedAccount,
  CreatePlaidCredentials,
  PlaidCredentials,
  QuickBooksOAuthCredentials,
  CreateQuickBooksOAuthState,
  QuickBooksOAuthState,
  UpdateQuickBooksOAuthCredentials,
  CreateQuickBooksOAuthCredentials,
} from "../../entities";

export interface ILinkedAccountRepository {
  create(account: CreateLinkedAccount): Promise<LinkedAccount>;
  getById(id: number): Promise<LinkedAccount>;
  getByAccountId(accountId: number): Promise<LinkedAccount[]>;

  createPlaidCredentials(params: CreatePlaidCredentials): Promise<PlaidCredentials>;
  deletePlaidCredentials(linkedAccountId: number): Promise<void>;
  deleteLinkedAccount(id: number): Promise<void>;


  getQuickBooksOAuthCredentials(linkedAccountId: number): Promise<QuickBooksOAuthCredentials>;
  updateQuickBooksOAuthCredentials(params: UpdateQuickBooksOAuthCredentials, linkedAccountId: number): Promise<QuickBooksOAuthCredentials>;
  deleteQuickBooksOAuthCredentials(linkedAccountId: number): Promise<void>;
  createQuickBooksOAuthCredentials(params: CreateQuickBooksOAuthCredentials, linkedAccountId: number): Promise<void>;

  getQuickBooksOAuthState(state: string): Promise<QuickBooksOAuthState>;
  deleteQuickBooksOAuthStates(linkedAccountId: number): Promise<void>;
  createQuickBooksOAuthState(params: CreateQuickBooksOAuthState, linkedAccountId: number): Promise<void>;
}
