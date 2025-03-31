import type { OmitTimeStampFields } from "./utils";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  bankAccounts,
  bankAccountTransactions,
  bankAccountTransactionRelationships,
} from "@fundlevel/db/schema";

export type BankAccount = InferSelectModel<typeof bankAccounts>;
export type CreateBankAccountParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankAccounts>>,
  "companyId"
>;
export type UpdateBankAccountParams =
  Partial<CreateBankAccountParams>;

export type BankAccountTransaction = InferSelectModel<typeof bankAccountTransactions>;
export type CreateBankAccountTransactionParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankAccountTransactions>>,
  "companyId"
>;
export type UpdateBankAccountTransactionParams =
  Partial<CreateBankAccountTransactionParams>;

export type BankAccountTransactionRelationship = InferSelectModel<
  typeof bankAccountTransactionRelationships
>;
export type CreateBankAccountTransactionRelationshipParams = OmitTimeStampFields<
  InferInsertModel<typeof bankAccountTransactionRelationships>
>;