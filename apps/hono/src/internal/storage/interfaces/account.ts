import type { Account, CreateAccount } from "../../../internal/entities";

export interface IAccountRepository {
  getByUserId(id: string): Promise<Account | undefined>;

  create(account: CreateAccount): Promise<Account>;
}
