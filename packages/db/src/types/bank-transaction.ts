import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  bankTransactions,
  bankTransactionRelationships,
  bankTransactionRelationshipEntityType
} from "../schema/bank-transaction";
import type { OmitTimeStampFields } from "./utils";

// Transaction types
export type BankTransaction = InferSelectModel<typeof bankTransactions>;

export type CreateBankTransactionParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankTransactions>>,
  "companyId" | "id"
>;

export type UpdateBankTransactionParams = Partial<CreateBankTransactionParams>;

// Transaction relationship types
export type BankTransactionRelationship = InferSelectModel<
  typeof bankTransactionRelationships
>;

export type CreateBankTransactionRelationshipParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankTransactionRelationships>>,
  "bankTransactionId"
>;

export type BankTransactionRelationshipType = (typeof bankTransactionRelationshipEntityType.enumValues)[number];