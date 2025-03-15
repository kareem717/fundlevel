import type { LinkedAccount, CreateLinkedAccount } from "../../entities";

export interface ILinkedAccountRepository {
  create(account: CreateLinkedAccount): Promise<LinkedAccount>;
  getById(id: number): Promise<LinkedAccount>;
  getByAccountId(accountId: number): Promise<LinkedAccount[]>;
}
