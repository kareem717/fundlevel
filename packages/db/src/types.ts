import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  accounts,
  companies,
  plaidCredentials,
  plaidBankAccounts,
  plaidTransactions,
  quickBooksOauthCredentials,
  quickBooksOauthStates,
  quickBooksInvoices,
} from "./drizzle/schema";

export type Company = InferInsertModel<typeof companies>;
export type CreateCompanyParams = Omit<
  OmitEntityFields<InferSelectModel<typeof companies>>,
  "ownerId"
>;
export type UpdateCompanyParams = Partial<CreateCompanyParams>;

export type Account = InferInsertModel<typeof accounts>;
export type CreateAccountParams = OmitEntityFields<
  InferSelectModel<typeof accounts>
>;
export type UpdateAccountParams = Omit<Partial<CreateAccountParams>, "userId">;

export type PlaidCredential = InferInsertModel<typeof plaidCredentials>;
export type CreatePlaidCredentialParams = Omit<
  OmitTimeStampFields<InferSelectModel<typeof plaidCredentials>>,
  "companyId"
>;
export type UpdatePlaidCredentialParams = Partial<CreatePlaidCredentialParams>;

export type PlaidBankAccount = InferInsertModel<typeof plaidBankAccounts>;
export type CreatePlaidBankAccountParams = Omit<
  OmitTimeStampFields<InferSelectModel<typeof plaidBankAccounts>>,
  "companyId"
>;
export type UpdatePlaidBankAccountParams =
  Partial<CreatePlaidBankAccountParams>;

export type PlaidTransaction = InferInsertModel<typeof plaidTransactions>;
export type CreatePlaidTransactionParams = Omit<
  OmitTimeStampFields<InferSelectModel<typeof plaidTransactions>>,
  "companyId"
>;
export type UpdatePlaidTransactionParams =
  Partial<CreatePlaidTransactionParams>;

export type QuickBooksOauthCredential = InferInsertModel<
  typeof quickBooksOauthCredentials
>;
export type CreateQuickBooksOauthCredentialParams = Omit<
  OmitTimeStampFields<InferSelectModel<typeof quickBooksOauthCredentials>>,
  "companyId"
>;
export type UpdateQuickBooksOauthCredentialParams = Omit<
  Partial<CreateQuickBooksOauthCredentialParams>,
  "realmId"
>;

export type QuickBooksOauthState = InferInsertModel<
  typeof quickBooksOauthStates
>;
export type CreateQuickBooksOauthStateParams = Omit<
  InferSelectModel<typeof quickBooksOauthStates>,
  "companyId"
>;
export type UpdateQuickBooksOauthStateParams =
  Partial<CreateQuickBooksOauthStateParams>;

export type QuickBooksInvoice = InferSelectModel<typeof quickBooksInvoices>;
export type CreateQuickBooksInvoiceParams = Omit<
  InferInsertModel<typeof quickBooksInvoices>,
  "companyId"
>;
export type UpdateQuickBooksInvoiceParams =
  Partial<CreateQuickBooksInvoiceParams>;

// utils
type TimeStampFields = {
  createdAt: string | Date;
  updatedAt: string | Date | null;
};

type EntityFields = TimeStampFields & {
  id: string | number;
};

type OmitTimeStampFields<T extends Partial<TimeStampFields>> = Omit<
  T,
  "createdAt" | "updatedAt"
>;
type OmitEntityFields<T extends Partial<EntityFields>> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
