import type { Account, CreateAccountParams } from "../../entities";
import type { IAccountRepository } from "..";
import type { Client } from "@fundlevel/db";
import { accounts } from "@fundlevel/db/schema";
import { eq } from "@fundlevel/db";
export class AccountRepository implements IAccountRepository {
  constructor(private readonly db: Client) {}

  async getByUserId(id: string): Promise<Account | undefined> {
    const [data] = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, id));

    if (!data) {
      return undefined;
    }

    return data;
  }

  async create(params: CreateAccountParams): Promise<Account> {
    const [data] = await this.db
      .insert(accounts)
      .values(params)
      .returning();

    if (!data) {
      throw new Error("Failed to create account");
    }

    return data;
  }

  async getById(id: number): Promise<Account | undefined> {
    const [data] = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id));

    if (!data) {
      return undefined;
    }

    return data;
  }
}
