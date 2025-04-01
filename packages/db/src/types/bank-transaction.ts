import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  bankTransactions,
  bankTransactionRelationships
} from "../schema/bank-transaction";
import type { OmitTimeStampFields } from "./utils";

// Transaction types
export type BankTransaction = InferSelectModel<typeof bankTransactions>;

export type CreateBankTransactionParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankTransactions>>,
  "companyId"
>;

export type UpdateBankTransactionParams = Partial<CreateBankTransactionParams>;

// Transaction relationship types
export type BankTransactionRelationship = InferSelectModel<
  typeof bankTransactionRelationships
>;

export type CreateBankTransactionRelationshipParams = OmitTimeStampFields<
  InferInsertModel<typeof bankTransactionRelationships>
>;

export type UpdateBankTransactionRelationshipParams = Partial<
  Omit<
    CreateBankTransactionRelationshipParams,
    "bankTransactionId" | "entityId" | "entityType"
  >
>;
