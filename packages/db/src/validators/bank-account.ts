import { z } from "zod";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { bankAccounts } from "../schema/bank-account";

// Create schemas for the bank accounts table
export const BankAccountSchema = createSelectSchema(bankAccounts);

export const CreateBankAccountParamsSchema = createInsertSchema(
  bankAccounts,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

export const UpdateBankAccountParamsSchema = createUpdateSchema(
  bankAccounts,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});
