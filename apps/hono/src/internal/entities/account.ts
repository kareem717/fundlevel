import { OmitEntityFields } from "./utils";
import { Database } from "@fundlevel/supabase/types";
import { publicAccountsInsertSchemaSchema } from "@fundlevel/supabase/zod";

export type Account = Database["public"]["Tables"]["accounts"]["Row"];

export type CreateAccount = OmitEntityFields<Database["public"]["Tables"]["accounts"]["Insert"]>;

export const accountSchema = publicAccountsInsertSchemaSchema.openapi("Account").required();
