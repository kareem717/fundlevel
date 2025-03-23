import type {
  CreateCompanyParams,
  CreatePlaidCredentialParams,
  CreateQuickBooksOauthCredentialParams,
  CreateQuickBooksOauthStateParams,
  Company,
  UpdateQuickBooksOauthCredentialParams,
} from "../../entities";
import type { Client } from "@fundlevel/db";
import type { ICompanyRepository } from "../interfaces/company";
import {
  companies,
  plaidCredentials,
  quickBooksOauthCredentials,
  quickBooksOauthStates,
} from "@fundlevel/db/schema";
import { and, eq, like } from "@fundlevel/db";
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly db: Client) { }

  async create(params: CreateCompanyParams, ownerId: number) {
    const [data] = await this.db
      .insert(companies)
      .values({ ...params, ownerId })
      .returning();

    if (!data) {
      throw new Error("Failed to create company");
    }

    return data;
  }

  async getById(id: number): Promise<Company> {
    const [data] = await this.db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    return data;
  }

  async getByAccountId(accountId: number): Promise<Company[]> {
    const data = await this.db
      .select()
      .from(companies)
      .where(eq(companies.ownerId, accountId));

    return data;
  }

  async searchCompanies(query: string, accountId: number): Promise<Company[]> {
    // Create a base query
    const data = await this.db
      .select()
      .from(companies)
      .where(
        and(
          eq(companies.ownerId, accountId),
          like(companies.name, `%${query}%`),
        ),
      );

    return data;
  }

  async createPlaidCredentials(params: CreatePlaidCredentialParams, companyId: number) {
    const [data] = await this.db
      .insert(plaidCredentials)
      .values({ ...params, companyId })
      .returning();

    return data;
  }

  async deletePlaidCredentials(companyId: number): Promise<void> {
    await this.db
      .delete(plaidCredentials)
      .where(eq(plaidCredentials.companyId, companyId));
  }

  async deleteCompany(id: number): Promise<void> {
    // First delete any credentials
    try {
      await this.deletePlaidCredentials(id);
    } catch (error) {
      console.error("Error deleting Plaid credentials:", error);
    }

    // Then delete the linked account
    await this.db.delete(companies).where(eq(companies.id, id));
  }

  async getPlaidCredentialsByItemId(itemId: string) {
    const [data] = await this.db
      .select()
      .from(plaidCredentials)
      .where(eq(plaidCredentials.itemId, itemId))
      .limit(1);

    return data;
  }

  async getQuickBooksOAuthCredentials(companyId: number) {
    const [data] = await this.db
      .select()
      .from(quickBooksOauthCredentials)
      .where(eq(quickBooksOauthCredentials.companyId, companyId))
      .limit(1);

    if (!data) {
      throw new Error("Failed to get QuickBooks OAuth credentials");
    }

    return data;
  }

  async updateQuickBooksOAuthCredentials(
    params: UpdateQuickBooksOauthCredentialParams,
    companyId: number,
  ) {
    const [data] = await this.db
      .update(quickBooksOauthCredentials)
      .set(params)
      .where(eq(quickBooksOauthCredentials.companyId, companyId))
      .returning();

    if (!data) {
      throw new Error("Failed to update QuickBooks OAuth credentials");
    }

    return data;
  }

  async createQuickBooksOAuthCredentials(
    params: CreateQuickBooksOauthCredentialParams,
    companyId: number,
  ) {
    const [data] = await this.db
      .insert(quickBooksOauthCredentials)
      .values({
        ...params,
        companyId,
      })
      .returning();

    if (!data) {
      throw new Error("Failed to create QuickBooks OAuth credentials");
    }

    return data;
  }

  async updateTransactionCursor(
    companyId: number,
    cursor: string,
  ): Promise<void> {
    const [data] = await this.db
      .update(plaidCredentials)
      .set({ transactionCursor: cursor })
      .where(eq(plaidCredentials.companyId, companyId))
      .returning();

    if (!data) {
      throw new Error("Failed to update transaction cursor");
    }
  }

  async deleteQuickBooksOAuthCredentials(companyId: number) {
    await this.db
      .delete(quickBooksOauthCredentials)
      .where(eq(quickBooksOauthCredentials.companyId, companyId));
  }

  async getQuickBooksOauthState(state: string) {
    const [data] = await this.db
      .select()
      .from(quickBooksOauthStates)
      .where(eq(quickBooksOauthStates.state, state))
      .limit(1);

    return data;
  }

  async deleteQuickBooksOauthStates(companyId: number) {
    await this.db
      .delete(quickBooksOauthStates)
      .where(eq(quickBooksOauthStates.companyId, companyId));
  }

  async createQuickBooksOauthState(
    params: CreateQuickBooksOauthStateParams,
    companyId: number,
  ): Promise<void> {
    const [data] = await this.db
      .insert(quickBooksOauthStates)
      .values({
        ...params,
        companyId,
      })
      .returning();

    if (!data) {
      throw new Error("Failed to create QuickBooks OAuth state");
    }
  }

  async getCompanyByQuickBooksRealmId(
    realmId: string,
  ): Promise<Company | undefined> {
    const [data] = await this.db
      .select()
      .from(quickBooksOauthCredentials)
      .where(eq(quickBooksOauthCredentials.realmId, realmId))
      .limit(1);

    if (!data) {
      return undefined;
    }

    // Get the company using the company_id from the credentials
    const [company] = await this.db
      .select()
      .from(companies)
      .where(eq(companies.id, data.companyId))
      .limit(1);

    return company;
  }
}
