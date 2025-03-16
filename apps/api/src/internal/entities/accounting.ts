import type { Database } from "@fundlevel/supabase/types";
import {
  publicPlaidBankAccountsInsertSchemaSchema,
  publicPlaidBankAccountsRowSchemaSchema,
  publicPlaidTransactionsInsertSchemaSchema,
  publicPlaidTransactionsRowSchemaSchema,
} from "@fundlevel/supabase/zod";
import { z } from "@hono/zod-openapi";
import type { OmitEntityFields } from "./utils";

export type BankAccount =
  Database["public"]["Tables"]["plaid_bank_accounts"]["Row"];

export type CreateBankAccount = OmitEntityFields<
  Database["public"]["Tables"]["plaid_bank_accounts"]["Insert"]
>;

export type BankTransaction =
  Database["public"]["Tables"]["plaid_transactions"]["Row"];

export type CreateBankTransaction = OmitEntityFields<
  Database["public"]["Tables"]["plaid_transactions"]["Insert"]
>;

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
      linked_account_id: true,
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
