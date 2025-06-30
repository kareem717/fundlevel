import { z } from "zod";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import {
  bankTransactions,
  bankTransactionRelationships,
} from "../schema/bank-transaction";

export const BankTransactionRelationshipEntityTypeSchema = z.enum([
  "invoice",
] as const);

// Create schemas for transactions
export const BankTransactionSchema = createSelectSchema(bankTransactions);

export const CreateBankTransactionParamsSchema = createInsertSchema(
  bankTransactions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

export const UpdateBankTransactionParamsSchema = createUpdateSchema(
  bankTransactions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

// Create schemas for transaction relationships
export const BankTransactionRelationshipSchema = createSelectSchema(
  bankTransactionRelationships,
);

export const CreateBankTransactionRelationshipParamsSchema = createInsertSchema(
  bankTransactionRelationships,
).omit({
  createdAt: true,
  updatedAt: true,
  bankTransactionId: true,
});
