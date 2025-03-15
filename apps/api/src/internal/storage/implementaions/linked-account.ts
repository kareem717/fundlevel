import type {
  Account,
  CreateLinkedAccount,
  LinkedAccount,
} from "../../entities";
import type { Client } from "@fundlevel/supabase/types";
import type { ILinkedAccountRepository } from "../interfaces/linked-account";

export class LinkedAccountRepository implements ILinkedAccountRepository {
  constructor(private readonly sb: Client) {}

  async create(params: CreateLinkedAccount) {
    const { data, error } = await this.sb
      .from("linked_accounts")
      .insert(params)
      .select()
      .single();

    if (error || !data) {
      throw new Error("Failed to create account");
    }

    return data;
  }

  async getById(id: number): Promise<LinkedAccount> {
    const { data, error } = await this.sb
      .from("linked_accounts")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get linked accounts");
    }

    return data;
  }

  async getByAccountId(accountId: number): Promise<LinkedAccount[]> {
    const { data, error } = await this.sb
      .from("linked_accounts")
      .select()
      .eq("owner_id", accountId);

    if (error) {
      console.error(error);
      throw new Error("Failed to get linked accounts");
    }

    return data || [];
  }
}
