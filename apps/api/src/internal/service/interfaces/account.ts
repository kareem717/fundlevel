import type { Account, CreateAccountParams } from "@fundlevel/db/types";

export interface IAccountService {
  create(account: CreateAccountParams): Promise<Account>;
  get(filters: { id: number } | { userId: string }): Promise<Account | undefined>;
}
