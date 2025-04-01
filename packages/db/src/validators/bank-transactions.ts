import { z } from "zod";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import {
  bankTransactions,
  bankTransactionRelationships
} from "../schema/bank-transactions";

export const BankTransactionRelationshipEntityTypeSchema = z.enum([
  "invoice"
] as const);

// Create schemas for transactions
export const BankTransactionSchema = createSelectSchema(bankTransactions);

export const CreateBankTransactionParamsSchema = createInsertSchema(
  bankTransactions,
).omit({
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

export const UpdateBankTransactionParamsSchema = createUpdateSchema(
  bankTransactions,
).omit({
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

// Create schemas for transaction relationships
export const BankTransactionRelationshipSchema = createSelectSchema(
  bankTransactionRelationships,
);

export const CreateBankTransactionRelationshipParamsSchema =
  createInsertSchema(bankTransactionRelationships).omit({
    createdAt: true,
    updatedAt: true,
  });

export const UpdateBankTransactionRelationshipParamsSchema =
  createUpdateSchema(bankTransactionRelationships).omit({
    createdAt: true,
    updatedAt: true,
    bankTransactionId: true,
    entityId: true,
    entityType: true,
  }); 