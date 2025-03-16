import type {
  CreateLinkedAccount,
  LinkedAccount,
  PlaidCredentials,
  QuickBooksOAuthCredentials
} from "../../entities";

export interface ILinkedAccountService {
  getById(id: number): Promise<LinkedAccount>;
  getByAccountId(accountId: number): Promise<LinkedAccount[]>;
  create(params: CreateLinkedAccount): Promise<LinkedAccount>;
  deleteLinkedAccount(id: number): Promise<void>;

  deletePlaidCredentials(linkedAccountId: number): Promise<void>;
  createPlaidLinkToken({
    linkedAccountId,
  }: {
    linkedAccountId: number;
  }): Promise<string>;
  createPlaidCredentials(params: {
    linkedAccountId: number;
    publicToken: string;
  }): Promise<PlaidCredentials>;


  startQuickBooksOAuthFlow(linkedAccountId: number, redirectUrl: string): Promise<string>
  getQuickBooksOAuthCredentials(linkedAccountId: number): Promise<QuickBooksOAuthCredentials>
  deleteQuickBooksOAuthCredentials(linkedAccountId: number): Promise<void>;
  completeQuickBooksOAuthFlow(params: {
    code: string;
    state: string;
    realmId: string;
  }): Promise<string>
  
}
