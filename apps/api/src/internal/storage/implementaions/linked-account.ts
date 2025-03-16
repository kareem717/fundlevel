import type {
  CreateLinkedAccount,
  CreatePlaidCredentials,
  LinkedAccount,
} from "../../entities";
import type { Client } from "@fundlevel/supabase/types";
import type { ILinkedAccountRepository } from "../interfaces/linked-account";

export class LinkedAccountRepository implements ILinkedAccountRepository {
  constructor(private readonly sb: Client) { }

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

  async createPlaidCredentials(params: CreatePlaidCredentials) {
    const { data, error } = await this.sb
      .from("linked_account_plaid_credentials")
      .insert(params)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to store Plaid credentials");
    }

    return data;
  }

  async createMergeCredentials(params: CreatePlaidCredentials) {
    const { data, error } = await this.sb
      .from("linked_account_merge_credentials")
      .insert(params)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to store Merge credentials");
    }

    return data;
  }

  async deletePlaidCredentials(linkedAccountId: number): Promise<void> {
    const { error } = await this.sb
      .from("linked_account_plaid_credentials")
      .delete()
      .eq("linked_account_id", linkedAccountId);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete Plaid credentials");
    }
  }

  async deleteMergeCredentials(linkedAccountId: number): Promise<void> {
    const { error } = await this.sb
      .from("linked_account_merge_credentials")
      .delete()
      .eq("linked_account_id", linkedAccountId);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete Merge credentials");
    }
  }

  async deleteLinkedAccount(id: number): Promise<void> {
    // First delete any credentials
    try {
      await this.deletePlaidCredentials(id);
    } catch (error) {
      console.error("Error deleting Plaid credentials:", error);
    }

    try {
      await this.deleteMergeCredentials(id);
    } catch (error) {
      console.error("Error deleting Merge credentials:", error);
    }

    // Then delete the linked account
    const { error } = await this.sb
      .from("linked_accounts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete linked account");
    }
  }
}
