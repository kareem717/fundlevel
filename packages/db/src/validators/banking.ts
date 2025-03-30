import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import {
  bankAccounts,
  bankAccountTransactions,
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
