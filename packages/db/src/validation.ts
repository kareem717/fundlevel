import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { bankStatements } from "./schema/bank-statements";
import { nangoConnections } from "./schema/integration";
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
	bankStatementId: z
		.number()
		.describe(
			"The ID of the bank statement this transaction was extracted from",
		),
	currency: z
		.string()
		.length(3)
		.describe(
			"The currency of the transaction, i.e. USD, CAD, etc. If not provided, try to infer it from the source file.",
		),
});

export const SelectTransactionSchema = createSelectSchema(transactions);

export const SelectNangoConnectionSchema = createSelectSchema(nangoConnections);

export const InsertBankStatementSchema = createInsertSchema(bankStatements, {
	originalFileName: z
		.string()
		.describe("The original filename of the uploaded file"),
	r2Url: z.string().url().describe("The R2 URL where the file is stored"),
	fileType: z.string().describe("The MIME type of the file"),
	fileSize: z.string().describe("The size of the file in bytes"),
	processingStatus: z
		.enum(["pending", "processing", "completed", "failed"])
		.optional(),
});

export const SelectBankStatementSchema = createSelectSchema(bankStatements);
