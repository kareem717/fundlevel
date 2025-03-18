import type { Account, CreateAccount } from "../../entities";
import type { IAccountRepository } from "..";
import type { Client } from "@fundlevel/supabase"

export class AccountRepository implements IAccountRepository {
  constructor(private readonly sb: Client) { }

  async getByUserId(id: string): Promise<Account | undefined> {
    const { data, error } = await this.sb
      .from("accounts")
      .select("*")
      .eq("user_id", id);

    if (error) {
      console.error("Error fetching account by user ID:", error);
      throw new Error("Failed to fetch account by user ID");
    }

    return data?.[0];
  }

  async create(params: CreateAccount): Promise<Account> {
    const { data, error } = await this.sb
      .from("accounts")
      .insert(params)
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating account:", error);
      throw new Error("Failed to create account");
    }

    return data;
  }

  async getById(id: number): Promise<Account | undefined> {
    const { data, error } = await this.sb
      .from("accounts")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching account by ID:", error);
      throw new Error("Failed to fetch account by ID");
    }

    return data?.[0];
  }
}
