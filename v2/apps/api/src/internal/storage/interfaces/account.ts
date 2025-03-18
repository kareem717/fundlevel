import type { Account, CreateAccount } from "../../entities";

export interface IAccountRepository {
  getByUserId(id: string): Promise<Account | undefined>;

  create(account: CreateAccount): Promise<Account>;

  getById(id: number): Promise<Account | undefined>;
}
