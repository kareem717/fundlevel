import type {
  Company,
  CreateCompanyParams,
  CreateCompanyPlaidCredentialsParams,
  CompanyPlaidCredentials,
  CreateCompanyQuickBooksOauthCredentialParams,
  UpdateCompanyQuickBooksOauthCredentialParams,
  CompanyQuickBooksOauthCredential,
  QuickBooksOauthState,
  UpdateCompanySyncStatusParams,
  CreateQuickBooksOauthStateParams,
} from "@fundlevel/db/types";

export interface ICompanyRepository {
  create(account: CreateCompanyParams, ownerId: number): Promise<Company>;
  get(id: number): Promise<Company | undefined>;
  getMany(filter: { ids: number[] } | { ownerId: number }): Promise<Company[]>;

  createPlaidCredentials(
    params: CreateCompanyPlaidCredentialsParams,
    companyId: number,
  ): Promise<CompanyPlaidCredentials>;
  getPlaidCredentials(
    filter: { itemId: string } | { companyId: number },
  ): Promise<CompanyPlaidCredentials | undefined>;
  updatePlaidTransactionCursor(
    companyId: number,
    cursor: string,
  ): Promise<void>;

  getQuickBooksOAuthCredentials(
    filter: { companyId: number } | { realmId: string },
  ): Promise<CompanyQuickBooksOauthCredential | undefined>;
  updateQuickBooksOAuthCredentials(
    params: UpdateCompanyQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<CompanyQuickBooksOauthCredential>;
  createQuickBooksOAuthCredentials(
    params: CreateCompanyQuickBooksOauthCredentialParams,
    companyId: number,
  ): Promise<CompanyQuickBooksOauthCredential>;

  getQuickBooksOauthState(state: string): Promise<QuickBooksOauthState>;
  deleteQuickBooksOauthStates(companyId: number): Promise<void>;
  createQuickBooksOauthState(
    params: CreateQuickBooksOauthStateParams,
    companyId: number,
  ): Promise<void>;

  updateSyncStatus(
    params: UpdateCompanySyncStatusParams,
    companyId: number,
  ): Promise<void>;
}
