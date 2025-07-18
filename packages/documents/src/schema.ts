import { InsertTransactionSchema } from "@fundlevel/db/validation";

export const ExtractTransactionSchema = InsertTransactionSchema.pick({
	date: true,
	amountCents: true,
	merchant: true,
	description: true,
	currency: true,
});
