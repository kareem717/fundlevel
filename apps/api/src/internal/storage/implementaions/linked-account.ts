import type { Account, CreateLinkedAccount } from "../../entities";
import type { Client } from "@fundlevel/supabase/types";
import type { ILinkedAccountRepository } from "../interfaces/linked-account";

export class LinkedAccountRepository implements ILinkedAccountRepository {
  constructor(private readonly sb: Client) { }

  async create(params: CreateLinkedAccount) {
    const { data, error } = await this.sb.from("linked_accounts").insert(params).select().single();

    if (error || !data) {
      throw new Error("Failed to create account");
    }

    return data;
  }

}
