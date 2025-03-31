import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import {
  bankAccounts,
  bankAccountTransactions,
  bankAccountTransactionRelationships,
} from "@fundlevel/db/schema";

export const BankAccountSchema = createSelectSchema(bankAccounts);
export const CreateBankAccountParamsSchema = createInsertSchema(
  bankAccounts,
).omit({ createdAt: true, updatedAt: true, companyId: true });
export const UpdateBankAccountParamsSchema = createUpdateSchema(
  bankAccounts,
).omit({ createdAt: true, updatedAt: true, companyId: true });

export const BankAccountTransactionSchema = createSelectSchema(bankAccountTransactions);
export const CreateBankAccountTransactionParamsSchema = createInsertSchema(
  bankAccountTransactions,
).omit({ createdAt: true, updatedAt: true, companyId: true });
export const UpdateBankAccountTransactionParamsSchema = createUpdateSchema(
  bankAccountTransactions,
).omit({ createdAt: true, updatedAt: true, companyId: true });

export const BankAccountTransactionRelationshipSchema = createSelectSchema(
  bankAccountTransactionRelationships,
);
export const CreateBankAccountTransactionRelationshipParamsSchema =
  createInsertSchema(bankAccountTransactionRelationships).omit({
    createdAt: true,
    updatedAt: true,
  });
export const UpdateBankAccountTransactionRelationshipParamsSchema =
  createUpdateSchema(bankAccountTransactionRelationships).omit({
    createdAt: true,
    updatedAt: true,
    bankAccountTransactionId: true,
    entityId: true,
    entityType: true,
  });