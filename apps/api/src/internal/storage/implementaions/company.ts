import type {
  CreateCompany,
  CreatePlaidCredentials,
  CreateQuickBooksOAuthCredentials,
  CreateQuickBooksOAuthState,
  Company,
  UpdateQuickBooksOAuthCredentials,
} from "../../entities";
import type { Client } from "@fundlevel/supabase";
import type { ICompanyRepository } from "../interfaces/company";

export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly sb: Client) {}

  async create(params: CreateCompany) {
    const { data, error } = await this.sb
      .from("companies")
      .insert(params)
      .select()
      .single();

    if (error || !data) {
      throw new Error("Failed to create account");
    }

    return data;
  }

  async getById(id: number): Promise<Company> {
    const { data, error } = await this.sb
      .from("companies")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get linked accounts");
    }

    return data;
  }

  async getByAccountId(accountId: number): Promise<Company[]> {
    const { data, error } = await this.sb
      .from("companies")
      .select()
      .eq("owner_id", accountId);

    if (error) {
      console.error(error);
      throw new Error("Failed to get linked accounts");
    }

    return data || [];
  }

  async searchCompanies(query: string, accountId: number): Promise<Company[]> {
    // Create a base query

    const { data, error } = await this.sb
      .from("companies")
      .select()
      .eq("owner_id", accountId)
      .ilike("name", `%${query}%`);

    // Ex
    if (error) {
      throw new Error("Failed to search companies");
    }

    return data || [];
  }

  async createPlaidCredentials(params: CreatePlaidCredentials) {
    const { data, error } = await this.sb
      .from("plaid_credentials")
      .insert(params)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to store Plaid credentials");
    }

    return data;
  }

  async deletePlaidCredentials(companyId: number): Promise<void> {
    const { error } = await this.sb
      .from("plaid_credentials")
      .delete()
      .eq("company_id", companyId);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete Plaid credentials");
    }
  }

  async deleteCompany(id: number): Promise<void> {
    // First delete any credentials
    try {
      await this.deletePlaidCredentials(id);
    } catch (error) {
      console.error("Error deleting Plaid credentials:", error);
    }

    // Then delete the linked account
    const { error } = await this.sb.from("companies").delete().eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete linked account");
    }
  }

  async getPlaidCredentialsByItemId(itemId: string) {
    const { data, error } = await this.sb
      .from("plaid_credentials")
      .select()
      .eq("item_id", itemId)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get Plaid credentials");
    }

    return data;
  }

  async getQuickBooksOAuthCredentials(companyId: number) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .select()
      .eq("company_id", companyId)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async updateQuickBooksOAuthCredentials(
    params: UpdateQuickBooksOAuthCredentials,
    companyId: number,
  ) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .update(params)
      .eq("company_id", companyId)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async createQuickBooksOAuthCredentials(
    params: CreateQuickBooksOAuthCredentials,
    companyId: number,
  ) {
    const { data, error } = await this.sb
      .from("quick_books_oauth_credentials")
      .insert({
        ...params,
        company_id: companyId,
      })
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async updateTransactionCursor(
    companyId: number,
    cursor: string,
  ): Promise<void> {
    const { error } = await this.sb
      .from("plaid_credentials")
      .update({ transaction_cursor: cursor })
      .eq("company_id", companyId);

    if (error) {
      throw new Error(`Failed to update transaction cursor: ${error.message}`);
    }
  }

  async deleteQuickBooksOAuthCredentials(companyId: number) {
    await this.sb
      .from("quick_books_oauth_credentials")
      .delete()
      .eq("company_id", companyId);
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

  async deleteQuickBooksOAuthStates(companyId: number) {
    await this.sb
      .from("quick_books_oauth_states")
      .delete()
      .eq("company_id", companyId);
  }

  async createQuickBooksOAuthState(
    params: CreateQuickBooksOAuthState,
    companyId: number,
  ) {
    await this.sb.from("quick_books_oauth_states").insert({
      ...params,
      company_id: companyId,
    });
  }

  async getCompanyByQuickBooksRealmId(
    realmId: string,
  ): Promise<Company | undefined> {
    const { data: credentials, error: credentialsError } = await this.sb
      .from("quick_books_oauth_credentials")
      .select("company_id")
      .eq("realm_id", realmId)
      .single();

    if (credentialsError) {
      if (credentialsError.code === "PGRST116") {
        // Not found
        return undefined;
      }
      throw new Error(
        `Failed to find QuickBooks credentials: ${credentialsError.message}`,
      );
    }

    if (!credentials) {
      return undefined;
    }

    // Get the company using the company_id from the credentials
    const { data: company, error: companyError } = await this.sb
      .from("companies")
      .select("*")
      .eq("id", credentials.company_id)
      .single();

    if (companyError) {
      if (companyError.code === "PGRST116") {
        // Not found
        return undefined;
      }
      throw new Error(`Failed to find company: ${companyError.message}`);
    }

    return company;
  }
}
