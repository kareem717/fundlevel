import type { Account, CreateAccount } from "../../entities";

export interface IAccountService {
  getByUserId(id: string): Promise<Account | undefined>;

  create(account: CreateAccount): Promise<Account>;
}
