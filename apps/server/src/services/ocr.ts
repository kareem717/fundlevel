import { env } from "cloudflare:workers";
import { integrationSchema, transactionSchema } from "@fundlevel/db/schema";
import { InsertTransactionSchema } from "@fundlevel/db/validation";
import * as Sentry from "@sentry/cloudflare";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createDB } from "@/lib/db/client";
import { createMistralAIProvider } from "@/lib/mistral/client";
import { getQuickbookAccounts } from "@/lib/nango/quickbooks";

const TransactionSchema = InsertTransactionSchema.pick({
	date: true,
	amountCents: true,
	merchant: true,
	description: true,
	currency: true,
});

export interface ExtractTransactionsParams {
	fileUrl: string;
	fileType: string;
	userId: string;
	bankStatementId: number;
}

export interface ExtractedTransaction {
	date: string;
	amountCents: number;
	merchant: string;
	description: string;
	currency: string;
	quickbooksAccount?: { id: string; name: string };
}

export class OCRService {
	private db = createDB();
	private mistralClient = createMistralAIProvider();
	private readonly MODEL_NAME = "mistral-small-latest";

	async extractTransactions(
		params: ExtractTransactionsParams,
	): Promise<ExtractedTransaction[]> {
		const { fileUrl, fileType, userId, bankStatementId } = params;

		// Get QB connection for account classification
		const [nangoConnection] = await this.db
			.select()
			.from(integrationSchema.nangoConnections)
			.where(eq(integrationSchema.nangoConnections.userId, userId))
			.limit(1);

		let accountsPrompt = "";
		if (nangoConnection) {
			const accounts = await getQuickbookAccounts(nangoConnection.id);
			if (accounts.length > 0) {
				const accountsList = accounts
					.map((acc) => `- ${acc.name} (ID: ${acc.id})`)
					.join("\n");
				accountsPrompt = `Here are the available Quickbooks accounts, please classify each transaction into one of them and include the account name and ID:\n${accountsList}`;
			}
		}

		// Extract transactions using Mistral AI
		const transactions = await Sentry.startSpan(
			{
				name: "OCR Process",
				op: "ocr.process",
			},
			async () => {
				const startTime = performance.now();
				const response = await generateObject({
					model: this.mistralClient(this.MODEL_NAME),
					output: "array",
					schema: TransactionSchema.extend({
						quickbooksAccountId: z.string().optional(),
						quickbooksAccountName: z.string().optional(),
					}),
					abortSignal: AbortSignal.timeout(1000 * 45),
					messages: [
						{
							role: "system",
							content: `Extract the transactions from the provided files.${accountsPrompt ? `\n\n${accountsPrompt}` : ""}`,
						},
						{
							role: "user",
							content: [
								{
									type: "file",
									data: fileUrl,
									mimeType: fileType,
								},
							],
						},
					],
					providerOptions: {
						mistral: {
							documentPageLimit: 10,
						},
					},
				});

				const span = Sentry.getActiveSpan();
				if (span) {
					span.setAttribute(
						"ocr.completion_tokens",
						response.usage.completionTokens,
					);
					span.setAttribute("ocr.prompt_tokens", response.usage.promptTokens);
					span.setAttribute("ocr.model", this.MODEL_NAME);
					span.setAttribute("ocr.provider", "mistral");
					span.setAttribute(
						"ocr.processing_time_ms",
						performance.now() - startTime,
					);
				}

				return response.object.map(
					({ quickbooksAccountId, quickbooksAccountName, ...rest }) => {
						const result: ExtractedTransaction = { ...rest };
						if (quickbooksAccountId && quickbooksAccountName) {
							result.quickbooksAccount = {
								id: quickbooksAccountId,
								name: quickbooksAccountName,
							};
						}
						return result;
					},
				);
			},
		);

		// Save transactions to database
		await this.saveTransactions(transactions, userId, bankStatementId);

		return transactions;
	}

	private async saveTransactions(
		transactions: ExtractedTransaction[],
		userId: string,
		bankStatementId: number,
	): Promise<void> {
		if (transactions.length === 0) return;

		const table = transactionSchema.transactions;
		await Sentry.startSpan(
			{
				name: "DB Insert Transactions",
				op: "db.insert",
				attributes: {
					table: "transactions",
				},
			},
			async () => {
				const startTime = performance.now();

				await this.db.insert(table).values(
					transactions.map((transaction) => ({
						date: transaction.date,
						amountCents: transaction.amountCents,
						merchant: transaction.merchant,
						description: transaction.description,
						currency: transaction.currency,
						userId: userId,
						bankStatementId: bankStatementId,
					})),
				);

				const span = Sentry.getActiveSpan();
				if (span) {
					span.setAttribute(
						"db.insert.processing_time_ms",
						performance.now() - startTime,
					);
					span.setAttribute("db.insert.records_inserted", transactions.length);
					span.setAttribute("db.insert.bank_statement_id", bankStatementId);
				}
			},
		);
	}

	async getTransactionsByBankStatement(
		bankStatementId: number,
	): Promise<any[]> {
		return await this.db
			.select()
			.from(transactionSchema.transactions)
			.where(
				eq(transactionSchema.transactions.bankStatementId, bankStatementId),
			);
	}
}
