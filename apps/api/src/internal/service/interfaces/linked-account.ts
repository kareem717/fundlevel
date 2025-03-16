import type {
  CreateLinkedAccount,
  LinkedAccount,
  MergeCredentials,
  PlaidCredentials,
} from "../../entities";

export interface ILinkedAccountService {
  createMergeLinkToken(params: {
    linkedAccountId: number;
    organizationEmail: string;
    organizationName: string;
  }): Promise<string>;

  createMergeCredentials(params: {
    linkedAccountId: number;
    accountToken: string;
  }): Promise<MergeCredentials>;

  createPlaidLinkToken({
    linkedAccountId,
  }: {
    linkedAccountId: number;
  }): Promise<string>;

  createPlaidCredentials(params: {
    linkedAccountId: number;
    publicToken: string;
  }): Promise<PlaidCredentials>;

  getById(id: number): Promise<LinkedAccount>;
  getByAccountId(accountId: number): Promise<LinkedAccount[]>;
  create(params: CreateLinkedAccount): Promise<LinkedAccount>;

  deletePlaidCredentials(linkedAccountId: number): Promise<void>;
  deleteMergeCredentials(linkedAccountId: number): Promise<void>;
  deleteLinkedAccount(id: number): Promise<void>;
}
