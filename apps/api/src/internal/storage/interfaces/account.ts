import type { Account, CreateAccountParams } from "@fundlevel/db/types";

export interface IAccountRepository {
  get(
    filters: { id: number } | { userId: string },
  ): Promise<Account | undefined>;

  create(account: CreateAccountParams): Promise<Account>;
}
