import { z } from "zod";
import type { QuickbooksAccount } from "./types";

export const QuickbooksAccountSchema = z.object({
	id: z.string(),
	name: z.string(),
	account_type: z.string(),
	account_sub_type: z.string(),
	classification: z.string(),
	current_balance_cents: z.number(),
	active: z.boolean(),
	description: z.string().nullable(),
	acct_num: z.string().nullable(),
	sub_account: z.boolean(),
	fully_qualified_name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	_nango_metadata: z.object({
		deleted_at: z.date().nullable(),
		last_action: z.enum(["ADDED", "UPDATED", "DELETED"]),
		first_seen_at: z.date(),
		cursor: z.string(),
		last_modified_at: z.date(),
	}),
}) satisfies z.ZodType<QuickbooksAccount>;
