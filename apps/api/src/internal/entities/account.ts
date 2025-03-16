import type { OmitEntityFields } from "./utils";
import type { Database } from "@fundlevel/supabase/types";
import {
  publicAccountsInsertSchemaSchema,
  publicAccountsRowSchemaSchema,
} from "@fundlevel/supabase/zod";
import { z } from "@hono/zod-openapi";

export type Account = Database["public"]["Tables"]["accounts"]["Row"];

export type CreateAccount = OmitEntityFields<
  Database["public"]["Tables"]["accounts"]["Insert"]
>;

export const accountSchema = z
  .object({
    ...publicAccountsRowSchemaSchema.shape,
  })
  .openapi("Account")
  .required();

export const createAccountSchema = z
  .object({
    ...publicAccountsInsertSchemaSchema.pick({
      email: true,
    }).shape,
  })
  .openapi("CreateAccountParams")
  .required();
