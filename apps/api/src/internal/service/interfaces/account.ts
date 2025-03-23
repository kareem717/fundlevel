import type { Account, CreateAccountParams } from "../../entities";

export interface IAccountService {
  getByUserId(id: string): Promise<Account | undefined>;

  create(account: CreateAccountParams): Promise<Account>;
}
