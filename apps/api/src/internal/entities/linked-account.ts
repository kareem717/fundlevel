import type { Database } from "@fundlevel/supabase/types";
import {
  publicLinkedAccountMergeCredentialsInsertSchemaSchema,
  publicLinkedAccountMergeCredentialsRowSchemaSchema,
  publicLinkedAccountPlaidCredentialsInsertSchemaSchema,
  publicLinkedAccountPlaidCredentialsRowSchemaSchema,
  publicLinkedAccountsInsertSchemaSchema,
  publicLinkedAccountsRowSchemaSchema,
} from "@fundlevel/supabase/zod";
import { z } from "@hono/zod-openapi";

export type LinkedAccount =
  Database["public"]["Tables"]["linked_accounts"]["Row"];

export type CreateLinkedAccount = Omit<
  Database["public"]["Tables"]["linked_accounts"]["Insert"],
  "created_at" | "updated_at" | "id"
>;

export const linkedAccountSchema = z.object({
  ...publicLinkedAccountsRowSchemaSchema.shape
})
  .openapi("LinkedAccount")
  .required();
export const createLinkedAccounttSchema = z.object({
  ...publicLinkedAccountsInsertSchemaSchema
    .omit({
      created_at: true,
      updated_at: true,
      id: true,
      owner_id: true,
    }).shape
})
  .openapi("CreateLinkedAccountParams")
  .required();

export type MergeCredentials =
  Database["public"]["Tables"]["linked_account_merge_credentials"]["Row"];

export type CreateMergeCredentials = Omit<
  Database["public"]["Tables"]["linked_account_merge_credentials"]["Insert"],
  "created_at" | "updated_at"
>;
export const mergeCredentialsSchema = z.object({
  ...publicLinkedAccountMergeCredentialsRowSchemaSchema.shape
})
  .openapi("MergeCredentials")
  .required();
export const createMergeCredentialsSchema = z.object({
  ...publicLinkedAccountMergeCredentialsInsertSchemaSchema
    .omit({
      created_at: true,
      linked_account_id: true,
    }).shape
})
  .openapi("CreateMergeCredentialsParams")
  .required();

export type PlaidCredentials =
  Database["public"]["Tables"]["linked_account_plaid_credentials"]["Row"];

export type CreatePlaidCredentials = Omit<
  Database["public"]["Tables"]["linked_account_plaid_credentials"]["Insert"],
  "created_at" | "updated_at"
>;

export const plaidCredentialsSchema = z.object({
  ...publicLinkedAccountPlaidCredentialsRowSchemaSchema.shape
})
  .openapi("PlaidCredentials")
  .required();

export const createPlaidCredentialsSchema = z.object({
  ...publicLinkedAccountPlaidCredentialsInsertSchemaSchema
    .omit({
      created_at: true,
      linked_account_id: true,
    }).shape
})
  .openapi("CreatePlaidCredentialsParams")
  .required();
