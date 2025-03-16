import type {
  CreateLinkedAccount,
  CreatePlaidCredentials,
  CreateQuickBooksOAuthCredentials,
  CreateQuickBooksOAuthState,
  LinkedAccount,
  UpdateQuickBooksOAuthCredentials,
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

  async deleteLinkedAccount(id: number): Promise<void> {
    // First delete any credentials
    try {
      await this.deletePlaidCredentials(id);
    } catch (error) {
      console.error("Error deleting Plaid credentials:", error);
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

  async getQuickBooksOAuthCredentials(linkedAccountId: number) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .select()
      .eq("linked_account_id", linkedAccountId)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async updateQuickBooksOAuthCredentials(
    params: UpdateQuickBooksOAuthCredentials,
    linkedAccountId: number,
  ) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .update(params)
      .eq("linked_account_id", linkedAccountId)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async createQuickBooksOAuthCredentials(
    params: CreateQuickBooksOAuthCredentials,
    linkedAccountId: number,
  ) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .insert({
        ...params,
        linked_account_id: linkedAccountId,
      })
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async deleteQuickBooksOAuthCredentials(linkedAccountId: number) {
    await this.sb
      .from("quick_books_oauth_credentials")
      .delete()
      .eq("linked_account_id", linkedAccountId);
  }

  async getQuickBooksOAuthState(state: string) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_states")
      .select()
      .eq("state", state)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async deleteQuickBooksOAuthStates(linkedAccountId: number) {
    await this.sb
      .from("quick_books_oauth_states")
      .delete()
      .eq("linked_account_id", linkedAccountId);
  }

  async createQuickBooksOAuthState(
    params: CreateQuickBooksOAuthState,
    linkedAccountId: number,
  ) {
    await this.sb.from("quick_books_oauth_states").insert({
      ...params,
      linked_account_id: linkedAccountId,
    });
  }
}
