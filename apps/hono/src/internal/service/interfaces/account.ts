import type { Account, CreateAccount } from "../../../internal/entities";

export interface IAccountService {
  getByUserId(id: string): Promise<Account | undefined>;

  create(account: CreateAccount): Promise<Account>;
}
