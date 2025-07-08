import { env } from "cloudflare:workers";
import { integrationSchema, transactionSchema } from "@fundlevel/db/schema";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import * as Sentry from "@sentry/cloudflare";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { HTTPException } from "hono/http-exception";
import { createDB } from "@/lib/db/client";
import { createMistralAIProvider } from "@/lib/mistral/client";
import { getQuickbookAccounts } from "@/lib/nango/quickbooks";
import { getAuth } from "@/middleware/with-auth";
import { ocrRoutes, TransactionSchema } from "./routes";

export const ocrHandler = () =>
	new OpenAPIHono().openapi(ocrRoutes.transactions, async (c) => {
		//TODO: this ocr -> transaction logic can me merged using the ai sdk and mistral provider
		const { user } = getAuth(c);
		if (!user) {
			throw new HTTPException(403, { message: "Unauthorized" });
		}

		let userId: number;
		try {
			userId = Number.parseInt(user.id);
		} catch (error) {
			throw new HTTPException(500, {
				message: "Failed to parse user ID.",
				cause: error,
			});
		}

		const db = createDB();

		// Get QB connection
		const [nangoConnection] = await db
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

		const { file } = await c.req.valid("form");

		// upload file to r2
		let fileUrl: string;
		try {
			const tempFile = await env.DOCUMENTS_BUCKET.put(
				`${new Date().toISOString()}-${crypto.randomUUID()}`,
				file,
				{
					httpMetadata: {
						contentType: file.type,
					},
				},
			);
			if (!tempFile) {
				throw new HTTPException(500, {
					message: "Initializing file upload to R2 failed.",
				});
			}
			fileUrl = `${env.DOCUMENTS_BUCKET_URL}/${tempFile.key}`;
		} catch (error) {
			throw new HTTPException(500, {
				message: "Failed to upload file to R2.",
				cause: error,
			});
		}

		const mistralClient = createMistralAIProvider();
		const MODEL_NAME = "mistral-small-latest";

		let transactions: (z.infer<typeof TransactionSchema> & {
			quickbooksAccount?: { id: string; name: string };
		})[] = [];
		try {
			transactions = await Sentry.startSpan(
				{
					name: "OCR Process",
					op: "ocr.process",
				},
				async () => {
					const startTime = performance.now();
					const response = await generateObject({
						model: mistralClient(MODEL_NAME),
						output: "array",
						schema: TransactionSchema.extend({
							quickbooksAccountId: z.string().optional(),
							quickbooksAccountName: z.string().optional(),
						}),
						abortSignal: AbortSignal.timeout(1000 * 45),
						messages: [
							{
								role: "system",
								//TODO: centralize system prompts
								content: `Extract the transactions from the provided files.${accountsPrompt ? `\n\n${accountsPrompt}` : ""}`,
							},
							{
								role: "user",
								content: [
									{
										type: "file",
										data: fileUrl,
										mimeType: file.type,
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
						span.setAttribute("ocr.model", MODEL_NAME);
						span.setAttribute("ocr.provider", "mistral");
						span.setAttribute(
							"ocr.processing_time_ms",
							performance.now() - startTime,
						);
					}

					return response.object.map(
						({ quickbooksAccountId, quickbooksAccountName, ...rest }) => {
							const result: z.infer<typeof TransactionSchema> & {
								quickbooksAccount?: { id: string; name: string };
							} = { ...rest };
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
		} catch (error) {
			throw new HTTPException(500, {
				message: "Failed to process OCR.",
				cause: error,
			});
		}

		const table = transactionSchema.transactions;
		try {
			await Sentry.startSpan(
				{
					name: "DB Insert",
					op: "db.insert",
					attributes: {
						table: getTableConfig(table).name,
					},
				},
				async () => {
					const startTime = performance.now();

					if (transactions.length > 0) {
						await db.insert(table).values(
							transactions.map((transaction) => ({
								date: transaction.date,
								amountCents: transaction.amountCents,
								merchant: transaction.merchant,
								description: transaction.description,
								currency: transaction.currency,
								userId,
								sourceFileURL: fileUrl,
							})),
						);
					}

					const span = Sentry.getActiveSpan();
					if (span) {
						span.setAttribute(
							"db.insert.processing_time_ms",
							performance.now() - startTime,
						);
						span.setAttribute(
							"db.insert.records_inserted",
							transactions.length,
						);
						span.setAttribute("db.insert.source_file_url", fileUrl);
					}

					return transactions;
				},
			);
		} catch (error) {
			throw new HTTPException(500, {
				message: "Failed to insert transactions into the database.",
				cause: error,
			});
		}

		return c.json(transactions, 200);
	});
