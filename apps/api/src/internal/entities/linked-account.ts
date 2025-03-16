import type { Database } from "@fundlevel/supabase/types";
import {
  publicLinkedAccountsInsertSchemaSchema,
  publicLinkedAccountsRowSchemaSchema,
  publicLinkedAccountPlaidCredentialsInsertSchemaSchema,
  publicLinkedAccountPlaidCredentialsRowSchemaSchema,
} from "@fundlevel/supabase/zod";
import { z } from "@hono/zod-openapi";

export type LinkedAccount =
  Database["public"]["Tables"]["linked_accounts"]["Row"];

export type CreateLinkedAccount = Omit<
  Database["public"]["Tables"]["linked_accounts"]["Insert"],
  "created_at" | "updated_at" | "id"
>;

export const linkedAccountSchema = z
  .object({
    ...publicLinkedAccountsRowSchemaSchema.shape,
  })
  .openapi("LinkedAccount")
  .required();
export const createLinkedAccounttSchema = z
  .object({
    ...publicLinkedAccountsInsertSchemaSchema.omit({
      created_at: true,
      updated_at: true,
      id: true,
      owner_id: true,
    }).shape,
  })
  .openapi("CreateLinkedAccountParams")
  .required();


export type PlaidCredentials =
  Database["public"]["Tables"]["linked_account_plaid_credentials"]["Row"];

export type CreatePlaidCredentials = Omit<
  Database["public"]["Tables"]["linked_account_plaid_credentials"]["Insert"],
  "created_at" | "updated_at"
>;

export const plaidCredentialsSchema = z
  .object({
    ...publicLinkedAccountPlaidCredentialsRowSchemaSchema.shape,
  })
  .openapi("PlaidCredentials")
  .required();

export const createPlaidCredentialsSchema = z
  .object({
    ...publicLinkedAccountPlaidCredentialsInsertSchemaSchema.omit({
      created_at: true,
      linked_account_id: true,
    }).shape,
  })
  .openapi("CreatePlaidCredentialsParams")
  .required();

export type QuickBooksOAuthCredentials =
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Row"];
export type CreateQuickBooksOAuthCredentials = Omit<
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Insert"],
  "linked_account_id" | "created_at" | "updated_at"
>;
export type UpdateQuickBooksOAuthCredentials = Omit<
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Update"],
  "linked_account_id" | "realm_id" | "created_at" | "updated_at"
>;

export type QuickBooksOAuthState =
  Database["public"]["Tables"]["quick_books_oauth_states"]["Row"];
export type CreateQuickBooksOAuthState = Omit<
  Database["public"]["Tables"]["quick_books_oauth_states"]["Insert"],
  "linked_account_id"
>;

/**
 * Represents a QuickBooks webhook event
 */
export interface WebhookEvent {
  eventNotifications: Array<{
    realmId: string;
    dataChangeEvent: {
      entities: Array<{
        name: string;
        id: string;
        operation: "Create" | "Update" | "Delete";
        lastUpdated: string;
      }>;
    };
  }>;
}
