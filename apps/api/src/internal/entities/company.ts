import type { Database } from "@fundlevel/supabase/types";
import {
  publicCompaniesInsertSchemaSchema,
  publicCompaniesRowSchemaSchema,
  publicPlaidCredentialsInsertSchemaSchema,
  publicPlaidCredentialsRowSchemaSchema,
} from "@fundlevel/supabase/zod";
import { z } from "@hono/zod-openapi";

export type Company = Database["public"]["Tables"]["companies"]["Row"];

export type CreateCompany = Omit<
  Database["public"]["Tables"]["companies"]["Insert"],
  "created_at" | "updated_at" | "id"
>;

export const companieschema = z
  .object({
    ...publicCompaniesRowSchemaSchema.shape,
  })
  .openapi("Company")
  .required();
export const createCompanytSchema = z
  .object({
    ...publicCompaniesInsertSchemaSchema.omit({
      created_at: true,
      updated_at: true,
      id: true,
      owner_id: true,
    }).shape,
  })
  .openapi("CreateCompanyParams")
  .required();

export type PlaidCredentials =
  Database["public"]["Tables"]["plaid_credentials"]["Row"];

export type CreatePlaidCredentials = Omit<
  Database["public"]["Tables"]["plaid_credentials"]["Insert"],
  "created_at" | "updated_at"
>;

export const plaidCredentialsSchema = z
  .object({
    ...publicPlaidCredentialsRowSchemaSchema.shape,
  })
  .openapi("PlaidCredentials")
  .required();

export const createPlaidCredentialsSchema = z
  .object({
    ...publicPlaidCredentialsInsertSchemaSchema.omit({
      created_at: true,
      company_id: true,
    }).shape,
  })
  .openapi("CreatePlaidCredentialsParams")
  .required();

export type QuickBooksOAuthCredentials =
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Row"];
export type CreateQuickBooksOAuthCredentials = Omit<
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Insert"],
  "company_id" | "created_at" | "updated_at"
>;
export type UpdateQuickBooksOAuthCredentials = Omit<
  Database["public"]["Tables"]["quick_books_oauth_credentials"]["Update"],
  "company_id" | "realm_id" | "created_at" | "updated_at"
>;

export type QuickBooksOAuthState =
  Database["public"]["Tables"]["quick_books_oauth_states"]["Row"];
export type CreateQuickBooksOAuthState = Omit<
  Database["public"]["Tables"]["quick_books_oauth_states"]["Insert"],
  "company_id"
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
