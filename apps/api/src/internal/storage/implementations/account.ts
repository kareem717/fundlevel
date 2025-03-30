import type { Account, CreateAccountParams } from "@fundlevel/db/types";
import type { IAccountRepository } from "../interfaces";
import type { IDB } from "../index";
import { accounts } from "@fundlevel/db/schema";
import { eq } from "drizzle-orm";

export class AccountRepository implements IAccountRepository {
  constructor(private readonly db: IDB) { }

  async get(filters: { id: number } | { userId: string }): Promise<Account | undefined> {
    const qb = this.db
      .select()
      .from(accounts)
      .$dynamic();

    if ("id" in filters) {
      qb.where(eq(accounts.id, filters.id));
    } else if ("userId" in filters) {
      qb.where(eq(accounts.userId, filters.userId));
    } else {
      throw new Error("Invalid filters");
    }

    const [data] = await qb;

    if (!data) {
      return undefined;
    }

    return data;
  }

  async create(params: CreateAccountParams): Promise<Account> {
    const [data] = await this.db.insert(accounts).values(params).returning();

    if (!data) {
      throw new Error("Failed to create account");
    }

    return data;
  }
}
