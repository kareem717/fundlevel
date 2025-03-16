import { z } from "@hono/zod-openapi";
import type { OmitEntityFields } from "./utils";
import type { Database } from "@fundlevel/supabase/types";
import { publicPlaidBankAccountsInsertSchemaSchema, publicPlaidTransactionsInsertSchemaSchema, publicPlaidTransactionsRowSchemaSchema } from "@fundlevel/supabase/zod";
import { publicPlaidBankAccountsRowSchemaSchema } from "@fundlevel/supabase/zod";

export type BankAccount =
  Database["public"]["Tables"]["plaid_bank_accounts"]["Row"];

export type CreateBankAccount =
  Omit<Database["public"]["Tables"]["plaid_bank_accounts"]["Insert"], "id" | "company_id" | "created_at" | "updated_at">

export type UpdateBankAccount =
  Omit<Database["public"]["Tables"]["plaid_bank_accounts"]["Update"], "id" | "company_id" | "created_at" | "updated_at">

export type BankTransaction =
  Database["public"]["Tables"]["plaid_transactions"]["Row"];

export type CreateBankTransaction =
  Omit<Database["public"]["Tables"]["plaid_transactions"]["Insert"], "id" | "company_id" | "created_at" | "updated_at">;

export const bankAccountSchema = z
  .object({
    ...publicPlaidBankAccountsRowSchemaSchema.shape,
  })
  .openapi("BankAccount")
  .required();

export const createBankAccountSchema = z
  .object({
    ...publicPlaidBankAccountsInsertSchemaSchema.omit({
      id: true,
      company_id: true,
      created_at: true,
      updated_at: true,
    }).shape,
  })
  .openapi("CreateBankAccountParams")
  .required();

export const bankTransactionSchema = z
  .object({
    ...publicPlaidTransactionsRowSchemaSchema.shape,
  })
  .openapi("BankTransaction")
  .required();

export const createBankTransactionSchema = z
  .object({
    ...publicPlaidTransactionsInsertSchemaSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
    }).shape,
  })
  .openapi("CreateBankTransactionParams")
  .required();
