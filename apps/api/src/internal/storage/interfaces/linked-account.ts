import type {
  LinkedAccount,
  CreateLinkedAccount,
  CreatePlaidCredentials,
  CreateMergeCredentials,
  PlaidCredentials,
  MergeCredentials,
} from "../../entities";

export interface ILinkedAccountRepository {
  create(account: CreateLinkedAccount): Promise<LinkedAccount>;
  getById(id: number): Promise<LinkedAccount>;
  getByAccountId(accountId: number): Promise<LinkedAccount[]>;

  createPlaidCredentials(
    params: CreatePlaidCredentials,
  ): Promise<PlaidCredentials>;
  createMergeCredentials(
    params: CreateMergeCredentials,
  ): Promise<MergeCredentials>;

  deletePlaidCredentials(linkedAccountId: number): Promise<void>;
  deleteMergeCredentials(linkedAccountId: number): Promise<void>;
  deleteLinkedAccount(id: number): Promise<void>;
}
