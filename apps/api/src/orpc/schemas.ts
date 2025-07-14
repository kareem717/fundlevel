import { InsertTransactionSchema } from "@fundlevel/db/validation";
import { z } from "zod";

export const RedirectResponseSchema = z.object({
	location: z.string().url().describe("URL to redirect to"),
	shouldRedirect: z.boolean().describe("Whether to redirect to the URL"),
});

export const ExtractTransactionSchema = InsertTransactionSchema.pick({
	date: true,
	amountCents: true,
	merchant: true,
	description: true,
	currency: true,
}).extend({
	quickbooksAccountId: z.string().optional(),
	quickbooksAccountName: z.string().optional(),
});
