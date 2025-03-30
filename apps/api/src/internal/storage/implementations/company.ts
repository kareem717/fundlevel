import type {
  CreateCompanyParams,
  CreateCompanyPlaidCredentialsParams,
  CreateCompanyQuickBooksOauthCredentialParams,
  Company,
  UpdateCompanyQuickBooksOauthCredentialParams,
  CompanyPlaidCredentials,
  CompanyQuickBooksOauthCredential,
  QuickBooksOauthState,
  UpdateCompanySyncStatusParams,
  CreateQuickBooksOauthStateParams
} from "@fundlevel/db/types";
import type { ICompanyRepository } from "../interfaces/company";
import {
  companies,
  companyPlaidCredentials,
  companyQuickBooksOauthCredentials,
  quickBooksOauthStates,
  companySyncStatus
} from "@fundlevel/db/schema";
import { and, eq, inArray, like } from "drizzle-orm";
import type { IDB } from "../index";

export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly db: IDB) { }

  async create(params: CreateCompanyParams, ownerId: number): Promise<Company> {
    const [data] = await this.db
      .insert(companies)
      .values({ ...params, ownerId })
      .returning();

    if (!data) {
      throw new Error("Failed to create company");
    }

    return data;
  }

  async get(id: number): Promise<Company | undefined> {
    const [data] = await this.db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    return data;
  }

  async getMany(filter: { ids: number[] } | { ownerId: number }): Promise<Company[]> {
    if ('ids' in filter) {
      return await this.db.select().from(companies).where(inArray(companies.id, filter.ids));
    }

    return await this.db.select().from(companies).where(eq(companies.ownerId, filter.ownerId));
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

  async createPlaidCredentials(
    params: CreateCompanyPlaidCredentialsParams,
    companyId: number,
  ) {
    const [data] = await this.db
      .insert(companyPlaidCredentials)
      .values({ ...params, companyId })
      .returning();

    if (!data) {
      throw new Error("Failed to create Plaid credentials");
    }

    return data;
  }

  async getPlaidCredentials(
    filter: { itemId: string } | { companyId: number }
  ): Promise<CompanyPlaidCredentials | undefined> {
    if ('itemId' in filter) {
      const [data] = await this.db
        .select()
        .from(companyPlaidCredentials)
        .where(eq(companyPlaidCredentials.itemId, filter.itemId))
        .limit(1);

      return data;
    }

    const [data] = await this.db
      .select()
      .from(companyPlaidCredentials)
      .where(eq(companyPlaidCredentials.companyId, filter.companyId))
      .limit(1);

    return data;
  }

  async deletePlaidCredentials(companyId: number): Promise<void> {
    await this.db
      .delete(companyPlaidCredentials)
      .where(eq(companyPlaidCredentials.companyId, companyId));
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

  async updatePlaidTransactionCursor(companyId: number, cursor: string): Promise<void> {
    const [data] = await this.db
      .update(companyPlaidCredentials)
      .set({ transactionCursor: cursor })
      .where(eq(companyPlaidCredentials.companyId, companyId))
      .returning();

    if (!data) {
      throw new Error("Failed to update transaction cursor");
    }
  }

  async getQuickBooksOAuthCredentials(
    filter: { companyId: number } | { realmId: string }
  ): Promise<CompanyQuickBooksOauthCredential | undefined> {
    if ('companyId' in filter) {
      const [data] = await this.db
        .select()
        .from(companyQuickBooksOauthCredentials)
        .where(eq(companyQuickBooksOauthCredentials.companyId, filter.companyId))
        .limit(1);

      return data;
    }

    const [data] = await this.db
      .select()
      .from(companyQuickBooksOauthCredentials)
      .where(eq(companyQuickBooksOauthCredentials.realmId, filter.realmId))
      .limit(1);

    return data;
  }

  async updateQuickBooksOAuthCredentials(
    params: UpdateCompanyQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<CompanyQuickBooksOauthCredential> {
    const [data] = await this.db
      .update(companyQuickBooksOauthCredentials)
      .set(params)
      .where(eq(companyQuickBooksOauthCredentials.companyId, companyId))
      .returning();

    if (!data) {
      throw new Error("Failed to update QuickBooks OAuth credentials");
    }

    return data;
  }

  async createQuickBooksOAuthCredentials(
    params: CreateCompanyQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<CompanyQuickBooksOauthCredential> {
    const [data] = await this.db
      .insert(companyQuickBooksOauthCredentials)
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

  async deleteQuickBooksOAuthCredentials(companyId: number): Promise<void> {
    await this.db
      .delete(companyQuickBooksOauthCredentials)
      .where(eq(companyQuickBooksOauthCredentials.companyId, companyId));
  }

  async getQuickBooksOauthState(state: string): Promise<QuickBooksOauthState> {
    const [data] = await this.db
      .select()
      .from(quickBooksOauthStates)
      .where(eq(quickBooksOauthStates.state, state))
      .limit(1);

    if (!data) {
      throw new Error("Failed to get QuickBooks OAuth state");
    }

    return data;
  }

  async deleteQuickBooksOauthStates(companyId: number): Promise<void> {
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

  async updateSyncStatus(
    params: UpdateCompanySyncStatusParams,
    companyId: number,
  ): Promise<void> {
    await this.db
      .update(companySyncStatus)
      .set(params)
      .where(eq(companySyncStatus.companyId, companyId))
  }
}
