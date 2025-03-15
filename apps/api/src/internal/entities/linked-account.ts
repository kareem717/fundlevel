import type { OmitEntityFields } from "./utils";
import type { Database } from "@fundlevel/supabase/types";
import { publicLinkedAccountsInsertSchemaSchema, publicLinkedAccountsRowSchemaSchema } from "@fundlevel/supabase/zod";

export type LinkedAccount = Database["public"]["Tables"]["linked_accounts"]["Row"];

export type CreateLinkedAccount = OmitEntityFields<Database["public"]["Tables"]["linked_accounts"]["Insert"]>;

export const linkedAccountSchema = publicLinkedAccountsRowSchemaSchema.openapi("LinkedAccount").required();
export const createLinkedAccounttSchema = publicLinkedAccountsInsertSchemaSchema.pick({
  name: true,
  merge_dev_account_token: true,
}).openapi("CreateLinkedAccountParams").required();
