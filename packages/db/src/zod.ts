import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { transactions } from "./schema/transactions";

export const InsertTransactionSchema = createInsertSchema(transactions, {
	date: z.string().date().describe("The date of the transaction"),
	amountCents: z
		.number()
		.describe(
			"The amount of the transaction, use negative numbers for debits and positive numbers for credits. The amount is in cents, so $10.00 is 1000",
		),
	merchant: z.string().describe("The merchant of the transaction"),
	description: z
		.string()
		.describe(
			"The description of the transaction, i.e. Payroll, E-Transfer, etc.",
		),
	sourceFileURL: z.string().url().describe("The URL of the source file"),
	currency: z
		.string()
		.length(3)
		.describe(
			"The currency of the transaction, i.e. USD, CAD, etc. If not provided, try to infer it from the source file.",
		),
});
