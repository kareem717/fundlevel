import type { Account, CreateAccount } from "../../../internal/entities";
import { IAccountRepository } from "../../../internal/storage";
import { UUID } from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import { Client, Database } from "@fundlevel/supabase/types";

export class AccountRepository implements IAccountRepository {
  constructor(private readonly sb: Client) { }

  async getByUserId(id: UUID): Promise<Account | undefined> {
    return (
      await this.sb.from("accounts").select("*").eq("user_id", id)
    ).data?.[0];
  }

  async create(params: CreateAccount): Promise<Account> {
    const { data, error } = await this.sb.from("accounts").insert(params).select().single();

    if (error || !data) {
      throw new Error("Failed to create account");
    }

    return data;
  }
}
