import { env } from "cloudflare:workers";
import { transactionSchema } from "@fundlevel/db/schema";
import { OpenAPIHono, type z } from "@hono/zod-openapi";
import * as Sentry from "@sentry/cloudflare";
import { generateObject } from "ai";
import { getTableConfig } from "drizzle-orm/pg-core";
import { HTTPException } from "hono/http-exception";
import { createDB } from "@/lib/utils/db";
import { createMistralAIProvider } from "@/lib/utils/mistral";
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
					message: "Failed to upload file to R2.",
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

		let transactions: z.infer<typeof TransactionSchema>[] = [];
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
						schema: TransactionSchema,
						abortSignal: AbortSignal.timeout(1000 * 45),
						messages: [
							{
								role: "system",
								//TODO: centralize system prompts
								content: "Extract the transactions from the provided files",
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

					return response.object;
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

					const db = createDB();

					await db.insert(table).values(
						transactions.map((transaction) => ({
							...transaction,
							userId,
							sourceFileURL: fileUrl,
						})),
					);

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
