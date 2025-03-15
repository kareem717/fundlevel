import type { OmitEntityFields } from "./utils";
import type { Database } from "@fundlevel/supabase/types";
import {
  publicAccountsInsertSchemaSchema,
  publicAccountsRowSchemaSchema,
} from "@fundlevel/supabase/zod";

export type Account = Database["public"]["Tables"]["accounts"]["Row"];

export type CreateAccount = OmitEntityFields<
  Database["public"]["Tables"]["accounts"]["Insert"]
>;

export const accountSchema = publicAccountsRowSchemaSchema
  .openapi("Account")
  .required();
export const createAccountSchema = publicAccountsInsertSchemaSchema
  .pick({
    email: true,
  })
  .openapi("CreateAccountParams")
  .required();
