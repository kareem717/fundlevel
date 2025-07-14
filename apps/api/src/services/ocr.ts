//
//
//
//
//
// DEPRECATED!!!
//
//
//
//
//
//
//

// import { createDB } from "@fundlevel/api/lib/db/client";
// import { createMistralAIProvider } from "@fundlevel/api/lib/mistral/client";
// import { getQuickbookAccounts } from "@fundlevel/api/lib/nango/quickbooks";
// import {
// 	buildBankStatementPrompt,
// 	buildReceiptPrompt,
// } from "@fundlevel/api/lib/prompts";
// import {
// 	integrationSchema,
// 	receiptSchema,
// 	transactionSchema,
// } from "@fundlevel/db/schema";
// import type { ReceiptItem, Transaction } from "@fundlevel/db/types";
// import {
// 	InsertReceiptItemSchema,
// 	InsertTransactionSchema,
// } from "@fundlevel/db/validation";
// import * as Sentry from "@sentry/bun";
// import { generateObject } from "ai";
// import { eq } from "drizzle-orm";
// import { z } from "zod";

// const TransactionSchema = InsertTransactionSchema.pick({
// 	date: true,
// 	amountCents: true,
// 	merchant: true,
// 	description: true,
// 	currency: true,
// });

// const ReceiptItemSchema = InsertReceiptItemSchema.pick({
// 	name: true,
// 	quantity: true,
// 	unitPriceCents: true,
// 	totalPriceCents: true,
// 	category: true,
// });

// const ReceiptMetadataSchema = z.object({
// 	merchantName: z.string().optional(),
// 	receiptDate: z.string().date().optional(),
// 	totalAmountCents: z.number().optional(),
// 	taxAmountCents: z.number().optional(),
// 	currency: z.string().optional(),
// });

// export interface ExtractTransactionsParams {
// 	fileUrl: string;
// 	fileType: string;
// 	userId: string;
// 	bankStatementId: number;
// }

// export interface ExtractReceiptItemsParams {
// 	fileUrl: string;
// 	fileType: string;
// 	userId: string;
// 	receiptId: number;
// }

// export interface ExtractedTransaction {
// 	date: string;
// 	amountCents: number;
// 	merchant: string;
// 	description: string;
// 	currency: string;
// 	quickbooksAccount?: { id: string; name: string };
// }

// export interface ExtractedReceiptItem {
// 	name: string;
// 	quantity: string;
// 	unitPriceCents: number;
// 	totalPriceCents: number;
// 	category?: string;
// 	quickbooksAccount?: { id: string; name: string };
// }

// export interface ExtractedReceiptData {
// 	metadata: {
// 		merchantName?: string;
// 		receiptDate?: string;
// 		totalAmountCents?: number;
// 		taxAmountCents?: number;
// 		currency?: string;
// 	};
// 	items: ExtractedReceiptItem[];
// }

// export class OCRService {
// 	private db = createDB();
// 	private mistralClient = createMistralAIProvider();
// 	private readonly MODEL_NAME = "mistral-small-latest";

// 	async extractTransactions(
// 		params: ExtractTransactionsParams,
// 	): Promise<ExtractedTransaction[]> {
// 		const { fileUrl, fileType, userId, bankStatementId } = params;

// 		// Get QB connection for account classification
// 		const [nangoConnection] = await this.db
// 			.select()
// 			.from(integrationSchema.nangoConnections)
// 			.where(eq(integrationSchema.nangoConnections.userId, userId))
// 			.limit(1);

// 		let accountsPrompt = "";
// 		if (nangoConnection) {
// 			const accounts = await getQuickbookAccounts(nangoConnection.id);
// 			if (accounts.length > 0) {
// 				const accountsList = accounts
// 					.map((acc) => `- ${acc.name} (ID: ${acc.id})`)
// 					.join("\n");
// 				accountsPrompt = `Here are the available Quickbooks accounts, please classify each transaction into one of them and include the account name and ID:\n${accountsList}`;
// 			}
// 		}

// 		// Extract transactions using Mistral AI
// 		const transactions = await Sentry.startSpan(
// 			{
// 				name: "OCR Process",
// 				op: "ocr.process",
// 			},
// 			async () => {
// 				const startTime = performance.now();
// 				const response = await generateObject({
// 					model: this.mistralClient(this.MODEL_NAME),
// 					output: "array",
// 					schema: TransactionSchema.extend({
// 						quickbooksAccountId: z.string().optional(),
// 						quickbooksAccountName: z.string().optional(),
// 					}),
// 					abortSignal: AbortSignal.timeout(1000 * 45),
// 					messages: [
// 						{
// 							role: "system",
// 							content: buildBankStatementPrompt(accountsPrompt),
// 						},
// 						{
// 							role: "user",
// 							content: [
// 								{
// 									type: "file",
// 									data: fileUrl,
// 									mimeType: fileType,
// 								},
// 							],
// 						},
// 					],
// 					providerOptions: {
// 						mistral: {
// 							documentPageLimit: 10,
// 						},
// 					},
// 				});

// 				const span = Sentry.getActiveSpan();
// 				if (span) {
// 					span.setAttribute(
// 						"ocr.completion_tokens",
// 						response.usage.completionTokens,
// 					);
// 					span.setAttribute("ocr.prompt_tokens", response.usage.promptTokens);
// 					span.setAttribute("ocr.model", this.MODEL_NAME);
// 					span.setAttribute("ocr.provider", "mistral");
// 					span.setAttribute(
// 						"ocr.processing_time_ms",
// 						performance.now() - startTime,
// 					);
// 				}

// 				return response.object.map(
// 					({ quickbooksAccountId, quickbooksAccountName, ...rest }) => {
// 						const result: ExtractedTransaction = { ...rest };
// 						if (quickbooksAccountId && quickbooksAccountName) {
// 							result.quickbooksAccount = {
// 								id: quickbooksAccountId,
// 								name: quickbooksAccountName,
// 							};
// 						}
// 						return result;
// 					},
// 				);
// 			},
// 		);

// 		// Save transactions to database
// 		await this.saveTransactions(transactions, userId, bankStatementId);

// 		return transactions;
// 	}

// 	async extractReceiptItems(
// 		params: ExtractReceiptItemsParams,
// 	): Promise<ExtractedReceiptData> {
// 		const { fileUrl, fileType, userId, receiptId } = params;

// 		// Get QB connection for account classification
// 		const [nangoConnection] = await this.db
// 			.select()
// 			.from(integrationSchema.nangoConnections)
// 			.where(eq(integrationSchema.nangoConnections.userId, userId))
// 			.limit(1);

// 		let accountsPrompt = "";
// 		if (nangoConnection) {
// 			const accounts = await getQuickbookAccounts(nangoConnection.id);
// 			if (accounts.length > 0) {
// 				const accountsList = accounts
// 					.map((acc) => `- ${acc.name} (ID: ${acc.id})`)
// 					.join("\n");
// 				accountsPrompt = `Here are the available Quickbooks accounts, please classify each item into one of them and include the account name and ID:\n${accountsList}`;
// 			}
// 		}

// 		// Extract receipt data using Mistral AI
// 		const receiptData = await Sentry.startSpan(
// 			{
// 				name: "Receipt OCR Process",
// 				op: "ocr.receipt.process",
// 			},
// 			async () => {
// 				const startTime = performance.now();
// 				const response = await generateObject({
// 					model: this.mistralClient(this.MODEL_NAME),
// 					schema: z.object({
// 						metadata: ReceiptMetadataSchema,
// 						items: z.array(
// 							ReceiptItemSchema.extend({
// 								quickbooksAccountId: z.string().optional(),
// 								quickbooksAccountName: z.string().optional(),
// 							}),
// 						),
// 					}),
// 					abortSignal: AbortSignal.timeout(1000 * 45),
// 					messages: [
// 						{
// 							role: "system",
// 							content: buildReceiptPrompt(accountsPrompt),
// 						},
// 						{
// 							role: "user",
// 							content: [
// 								{
// 									type: "file",
// 									data: fileUrl,
// 									mimeType: fileType,
// 								},
// 							],
// 						},
// 					],
// 					providerOptions: {
// 						mistral: {
// 							documentPageLimit: 10,
// 						},
// 					},
// 				});

// 				const span = Sentry.getActiveSpan();
// 				if (span) {
// 					span.setAttribute(
// 						"ocr.completion_tokens",
// 						response.usage.completionTokens,
// 					);
// 					span.setAttribute("ocr.prompt_tokens", response.usage.promptTokens);
// 					span.setAttribute("ocr.model", this.MODEL_NAME);
// 					span.setAttribute("ocr.provider", "mistral");
// 					span.setAttribute(
// 						"ocr.processing_time_ms",
// 						performance.now() - startTime,
// 					);
// 				}

// 				const extractedItems = response.object.items.map(
// 					({ quickbooksAccountId, quickbooksAccountName, ...rest }) => {
// 						const result: ExtractedReceiptItem = { ...rest };
// 						if (quickbooksAccountId && quickbooksAccountName) {
// 							result.quickbooksAccount = {
// 								id: quickbooksAccountId,
// 								name: quickbooksAccountName,
// 							};
// 						}
// 						return result;
// 					},
// 				);

// 				return {
// 					metadata: response.object.metadata,
// 					items: extractedItems,
// 				};
// 			},
// 		);

// 		// Update receipt with metadata and save items
// 		await this.updateReceiptMetadata(receiptId, receiptData.metadata);
// 		await this.saveReceiptItems(receiptData.items, userId, receiptId);

// 		return receiptData;
// 	}

// 	private async saveTransactions(
// 		transactions: ExtractedTransaction[],
// 		userId: string,
// 		bankStatementId: number,
// 	): Promise<void> {
// 		if (transactions.length === 0) return;

// 		const table = transactionSchema.transactions;
// 		await Sentry.startSpan(
// 			{
// 				name: "DB Insert Transactions",
// 				op: "db.insert",
// 				attributes: {
// 					table: "transactions",
// 				},
// 			},
// 			async () => {
// 				const startTime = performance.now();

// 				await this.db.insert(table).values(
// 					transactions.map((transaction) => ({
// 						date: transaction.date,
// 						amountCents: transaction.amountCents,
// 						merchant: transaction.merchant,
// 						description: transaction.description,
// 						currency: transaction.currency,
// 						userId: userId,
// 						bankStatementId: bankStatementId,
// 					})),
// 				);

// 				const span = Sentry.getActiveSpan();
// 				if (span) {
// 					span.setAttribute(
// 						"db.insert.processing_time_ms",
// 						performance.now() - startTime,
// 					);
// 					span.setAttribute("db.insert.records_inserted", transactions.length);
// 					span.setAttribute("db.insert.bank_statement_id", bankStatementId);
// 				}
// 			},
// 		);
// 	}

// 	private async updateReceiptMetadata(
// 		receiptId: number,
// 		metadata: {
// 			merchantName?: string;
// 			receiptDate?: string;
// 			totalAmountCents?: number;
// 			taxAmountCents?: number;
// 			currency?: string;
// 		},
// 	): Promise<void> {
// 		await this.db
// 			.update(receiptSchema.receipts)
// 			.set({
// 				merchantName: metadata.merchantName,
// 				receiptDate: metadata.receiptDate,
// 				totalAmountCents: metadata.totalAmountCents,
// 				taxAmountCents: metadata.taxAmountCents,
// 				currency: metadata.currency || "USD",
// 				updatedAt: new Date(),
// 			})
// 			.where(eq(receiptSchema.receipts.id, receiptId));
// 	}

// 	private async saveReceiptItems(
// 		items: ExtractedReceiptItem[],
// 		userId: string,
// 		receiptId: number,
// 	): Promise<void> {
// 		if (items.length === 0) return;

// 		const table = receiptSchema.receiptItems;
// 		await Sentry.startSpan(
// 			{
// 				name: "DB Insert Receipt Items",
// 				op: "db.insert",
// 				attributes: {
// 					table: "receipt_items",
// 				},
// 			},
// 			async () => {
// 				const startTime = performance.now();

// 				await this.db.insert(table).values(
// 					items.map((item) => ({
// 						name: item.name,
// 						quantity: item.quantity,
// 						unitPriceCents: item.unitPriceCents,
// 						totalPriceCents: item.totalPriceCents,
// 						category: item.category,
// 						userId: userId,
// 						receiptId: receiptId,
// 					})),
// 				);

// 				const span = Sentry.getActiveSpan();
// 				if (span) {
// 					span.setAttribute(
// 						"db.insert.processing_time_ms",
// 						performance.now() - startTime,
// 					);
// 					span.setAttribute("db.insert.records_inserted", items.length);
// 					span.setAttribute("db.insert.receipt_id", receiptId);
// 				}
// 			},
// 		);
// 	}

// 	async getTransactionsByBankStatement(
// 		bankStatementId: number,
// 	): Promise<Transaction[]> {
// 		return await this.db
// 			.select()
// 			.from(transactionSchema.transactions)
// 			.where(
// 				eq(transactionSchema.transactions.bankStatementId, bankStatementId),
// 			);
// 	}

// 	async getReceiptItemsByReceipt(receiptId: number): Promise<ReceiptItem[]> {
// 		return await this.db
// 			.select()
// 			.from(receiptSchema.receiptItems)
// 			.where(eq(receiptSchema.receiptItems.receiptId, receiptId));
// 	}
// }
