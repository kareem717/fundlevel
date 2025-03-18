import { z } from "@hono/zod-openapi";
import type { Database } from "@fundlevel/supabase";
import {
  publicPlaidBankAccountsInsertSchemaSchema,
  publicPlaidTransactionsInsertSchemaSchema,
  publicPlaidTransactionsRowSchemaSchema,
} from "@fundlevel/supabase";
import { publicPlaidBankAccountsRowSchemaSchema } from "@fundlevel/supabase";

export type BankAccount =
  Database["public"]["Tables"]["plaid_bank_accounts"]["Row"];

export type CreateBankAccount = Omit<
  Database["public"]["Tables"]["plaid_bank_accounts"]["Insert"],
  "company_id" | "created_at" | "updated_at"
>;

export type UpdateBankAccount = Omit<
  Database["public"]["Tables"]["plaid_bank_accounts"]["Update"],
  "remote_id" | "company_id" | "created_at" | "updated_at"
>;

export type BankTransaction =
  Database["public"]["Tables"]["plaid_transactions"]["Row"];

export type CreateBankTransaction = Omit<
  Database["public"]["Tables"]["plaid_transactions"]["Insert"],
  "id" | "company_id" | "created_at" | "updated_at"
>;

export type Invoice =
  Database["public"]["Tables"]["quick_books_invoices"]["Row"];

export type CreateInvoice = Omit<
  Database["public"]["Tables"]["quick_books_invoices"]["Insert"],
  "id" | "company_id" | "created_at" | "updated_at"
>;

export const bankAccountSchema = z
  .object({
    ...publicPlaidBankAccountsRowSchemaSchema.shape,
  })
  .omit({
    // Not sure why json types are causing issues
    remaining_remote_content: true,
  })
  .openapi("BankAccount")
  .required();

export const createBankAccountSchema = z
  .object({
    ...publicPlaidBankAccountsInsertSchemaSchema.shape,
  })
  .omit({
    company_id: true,
    created_at: true,
    updated_at: true,
  })
  .openapi("CreateBankAccountParams")
  .required();

export const bankTransactionSchema = z
  .object({
    ...publicPlaidTransactionsRowSchemaSchema.shape,
  })
  .omit({
    // Not sure why json types are causing issues
    remaining_remote_content: true,
  })
  .openapi("BankTransaction")
  .required();

export const createBankTransactionSchema = z
  .object({
    ...publicPlaidTransactionsInsertSchemaSchema.omit({
      created_at: true,
      company_id: true,
      updated_at: true,
    }).shape,
  })
  .openapi("CreateBankTransactionParams")
  .required();
