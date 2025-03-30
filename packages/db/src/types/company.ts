import type { OmitEntityFields, OmitTimeStampFields } from "./utils";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  companies,
  companyPlaidCredentials,
  companyQuickBooksOauthCredentials,
  companySyncStatus,
  quickBooksOauthStates,
} from "@fundlevel/db/schema";

export type CompanyQuickBooksOauthCredential = InferSelectModel<
  typeof companyQuickBooksOauthCredentials
>;
export type CreateCompanyQuickBooksOauthCredentialParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof companyQuickBooksOauthCredentials>>,
  "companyId"
>;
export type UpdateCompanyQuickBooksOauthCredentialParams = Omit<
  Partial<CreateCompanyQuickBooksOauthCredentialParams>,
  "realmId"
>;

export type QuickBooksOauthState = InferSelectModel<
  typeof quickBooksOauthStates
>;
export type CreateQuickBooksOauthStateParams = Omit<
  InferInsertModel<typeof quickBooksOauthStates>,
  "companyId"
>;
export type UpdateQuickBooksOauthStateParams =
  Partial<CreateQuickBooksOauthStateParams>;

export type Company = InferSelectModel<typeof companies>;
export type CreateCompanyParams = Omit<
  OmitEntityFields<InferInsertModel<typeof companies>>,
  | "ownerId"
  | "bankAccountsLastSyncedAt"
  | "transactionsLastSyncedAt"
  | "invoicesLastSyncedAt"
  | "journalEntriesLastSyncedAt"
  | "vendorCreditsLastSyncedAt"
  | "creditNotesLastSyncedAt"
  | "paymentsLastSyncedAt"
>;
export type UpdateCompanyParams = Partial<CreateCompanyParams>;

export type CompanyPlaidCredential = InferSelectModel<typeof companyPlaidCredentials>;
export type CreateCompanyPlaidCredentialParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof companyPlaidCredentials>>,
  "companyId"
>;
export type UpdateCompanyPlaidCredentialParams = Partial<CreateCompanyPlaidCredentialParams>;

export type CompanySyncStatus = InferSelectModel<typeof companySyncStatus>;
export type CreateCompanySyncStatusParams = Omit<
  InferInsertModel<typeof companySyncStatus>,
  "companyId"
>;
export type UpdateCompanySyncStatusParams = Partial<CreateCompanySyncStatusParams>;
