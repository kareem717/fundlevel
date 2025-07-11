import env from "@fundlevel/api/env";
import { createDB } from "@fundlevel/api/lib/db/client";
import { OCRService } from "@fundlevel/api/services/ocr";
import { bankStatementSchema, transactionSchema } from "@fundlevel/db/schema";
import {
	SelectBankStatementSchema,
	SelectTransactionSchema,
} from "@fundlevel/db/validation";
import { ORPCError } from "@orpc/server";
import * as Sentry from "@sentry/bun";
import { eq } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import z from "zod";
import { protectedProcedure } from "../init";

export const bankStatementRouter = {
	list: protectedProcedure
		.route({
			method: "GET",
			path: "/bank-statements",
			tags: ["Bank Statements"],
		})
		.output(
			SelectBankStatementSchema.array().describe("List of bank statements"),
		)
		.handler(async ({ context }) => {
			const { user } = context;
			const db = createDB();

			return await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(bankStatementSchema.bankStatements)
							.where(eq(bankStatementSchema.bankStatements.userId, user.id))
							.orderBy(bankStatementSchema.bankStatements.createdAt);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
							span.setAttribute("db.query.records_found", result.length);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch bank statements.",
							cause: error,
						});
					}
				},
			);
		}),

	upload: protectedProcedure
		.route({
			method: "POST",
			path: "/bank-statements/upload",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				form: z.object({
					file: z
						.instanceof(File)
						.refine(
							(file) =>
								file.type.startsWith("image/") ||
								file.type.startsWith("application/pdf"),
							{
								message: "Only image or PDF files are allowed",
							},
						)
						.describe("The bank statement file"),
				}),
			}),
		)
		.output(
			z.object({
				bankStatement: SelectBankStatementSchema.describe(
					"The uploaded bank statement",
				),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { file } = input.form;
			const db = createDB();

			// Upload file to R2
			const fileUrl = "";
			//TODO: fix and replace
			// let uploadedFile: R2Object;
			// try {
			// 	uploadedFile = await env.DOCUMENTS_BUCKET.put(
			// 		`${new Date().toISOString()}-${crypto.randomUUID()}`,
			// 		file,
			// 		{
			// 			httpMetadata: {
			// 				contentType: file.type,
			// 			},
			// 		},
			// 	);
			// 	if (!uploadedFile) {
			// 		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			// 			message: "Initializing file upload to R2 failed.",
			// 		});
			// 	}
			// 	fileUrl = `${env.DOCUMENTS_BUCKET_URL}/${uploadedFile.key}`;
			// } catch (error) {
			// 	throw new ORPCError("INTERNAL_SERVER_ERROR", {
			// 		message: "Failed to upload file to R2.",
			// 		cause: error,
			// 	});
			// }

			// Create bank statement record
			const [bankStatement] = await Sentry.startSpan(
				{
					name: "DB Insert",
					op: "db.insert",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const insertStartTime = performance.now();
						const result = await db
							.insert(bankStatementSchema.bankStatements)
							.values({
								originalFileName: file.name,
								r2Url: fileUrl,
								fileType: file.type,
								fileSize: file.size.toString(),
								userId: user.id,
								processingStatus: "pending",
							})
							.returning();

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.insert.processing_time_ms",
								performance.now() - insertStartTime,
							);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to create bank statement record.",
							cause: error,
						});
					}
				},
			);

			return { bankStatement };
		}),

	extract: protectedProcedure
		.route({
			method: "POST",
			path: "/bank-statements/{id}/extract",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				params: z.object({
					id: z
						.string()
						.describe("The ID of the bank statement to extract from"),
				}),
			}),
		)
		.output(
			z.object({
				success: z.boolean().describe("Whether the extraction was successful"),
				transactionsExtracted: z
					.number()
					.describe("Number of transactions extracted"),
				transactions: z.array(z.any()).describe("Extracted transactions"),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;
			const db = createDB();
			const ocrService = new OCRService();

			// Get the bank statement
			const [statement] = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(bankStatementSchema.bankStatements)
							.where(
								eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
							)
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch bank statement.",
							cause: error,
						});
					}
				},
			);

			if (!statement) {
				throw new ORPCError("NOT_FOUND", {
					message: "Bank statement not found",
				});
			}

			if (statement.userId !== user.id) {
				throw new ORPCError("FORBIDDEN", { message: "Access denied" });
			}

			// Update status to processing
			await Sentry.startSpan(
				{
					name: "DB Update",
					op: "db.update",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const updateStartTime = performance.now();
						await db
							.update(bankStatementSchema.bankStatements)
							.set({
								processingStatus: "processing",
								updatedAt: new Date(),
							})
							.where(
								eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
							);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.update.processing_time_ms",
								performance.now() - updateStartTime,
							);
						}
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to initialize bank statement processing.",
							cause: error,
						});
					}
				},
			);

			try {
				const transactions = await ocrService.extractTransactions({
					fileUrl: statement.r2Url,
					fileType: statement.fileType,
					userId: user.id,
					bankStatementId: statement.id,
				});
				// Update status to completed
				await Sentry.startSpan(
					{
						name: "DB Update",
						op: "db.update",
						attributes: {
							table: getTableConfig(bankStatementSchema.bankStatements).name,
						},
					},
					async () => {
						try {
							const updateStartTime = performance.now();
							await db
								.update(bankStatementSchema.bankStatements)
								.set({
									processingStatus: "completed",
									updatedAt: new Date(),
								})
								.where(
									eq(
										bankStatementSchema.bankStatements.id,
										Number.parseInt(id),
									),
								);

							const span = Sentry.getActiveSpan();
							if (span) {
								span.setAttribute(
									"db.update.processing_time_ms",
									performance.now() - updateStartTime,
								);
							}
						} catch (error) {
							throw new ORPCError("INTERNAL_SERVER_ERROR", {
								message: "Failed to update bank statement status.",
								cause: error,
							});
						}
					},
				);

				return {
					success: true,
					transactionsExtracted: transactions.length,
					transactions,
				};
			} catch (error) {
				// Update status to failed
				await Sentry.startSpan(
					{
						name: "DB Update",
						op: "db.update",
						attributes: {
							table: getTableConfig(bankStatementSchema.bankStatements).name,
						},
					},
					async () => {
						const updateStartTime = performance.now();
						await db
							.update(bankStatementSchema.bankStatements)
							.set({
								processingStatus: "failed",
								updatedAt: new Date(),
							})
							.where(
								eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
							);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.update.processing_time_ms",
								performance.now() - updateStartTime,
							);
						}
					},
				);

				throw error;
			}
		}),

	transactions: protectedProcedure
		.route({
			method: "GET",
			path: "/bank-statements/{id}/transactions",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				params: z.object({
					id: z.coerce.number().describe("The ID of the bank statement"),
				}),
			}),
		)
		.output(SelectTransactionSchema.array().describe("List of transactions"))
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;
			const db = createDB();
			const ocrService = new OCRService();

			// Check if the bank statement belongs to the user
			const [statement] = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(bankStatementSchema.bankStatements)
							.where(eq(bankStatementSchema.bankStatements.id, id))
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch bank statement.",
							cause: error,
						});
					}
				},
			);

			if (!statement) {
				throw new ORPCError("NOT_FOUND", {
					message: "Bank statement not found",
				});
			}

			if (statement.userId !== user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Bank statement does not belong to user",
				});
			}

			// Get transactions for this bank statement
			return await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(transactionSchema.transactions).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(transactionSchema.transactions)
							.where(eq(transactionSchema.transactions.bankStatementId, id))
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch transactions.",
							cause: error,
						});
					}
				},
			);
		}),

	exportCsv: protectedProcedure
		.route({
			method: "POST",
			path: "/bank-statements/{id}/export-csv",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				params: z.object({
					id: z.coerce.number().describe("The ID of the bank statement"),
				}),
			}),
		)
		.output(
			z.object({
				downloadUrl: z.string().url().describe("URL to download the CSV file"),
				fileName: z.string().describe("Name of the CSV file"),
				expiresAt: z
					.string()
					.datetime()
					.describe("Expiration date of the download URL"),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;
			const db = createDB();
			const ocrService = new OCRService();

			// Check if the bank statement belongs to the user
			const [statement] = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(bankStatementSchema.bankStatements)
							.where(eq(bankStatementSchema.bankStatements.id, id))
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						if (error instanceof ORPCError) {
							throw error;
						}
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch bank statement.",
							cause: error,
						});
					}
				},
			);

			if (!statement) {
				throw new ORPCError("NOT_FOUND", {
					message: "Bank statement not found",
				});
			}

			if (statement.userId !== user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Bank statement does not belong to user",
				});
			}

			const transactions = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(transactionSchema.transactions)
							.where(eq(transactionSchema.transactions.bankStatementId, id))
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						if (error instanceof ORPCError) {
							throw error;
						}
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch transactions.",
							cause: error,
						});
					}
				},
			);

			if (transactions.length === 0) {
				throw new ORPCError("BAD_REQUEST", {
					message: "No transactions to export",
				});
			}

			// Generate CSV content
			const csvHeader = "Date,Merchant,Description,Amount,Currency\n";
			const csvRows = transactions
				.map((transaction) => {
					const amount = (transaction.amountCents / 100).toFixed(2);
					// Escape commas and quotes in CSV
					const escapeCsvField = (field: string) => {
						if (
							field.includes(",") ||
							field.includes('"') ||
							field.includes("\n")
						) {
							return `"${field.replace(/"/g, '""')}"`;
						}
						return field;
					};

					return [
						transaction.date,
						escapeCsvField(transaction.merchant),
						escapeCsvField(transaction.description),
						amount,
						transaction.currency || "USD",
					].join(",");
				})
				.join("\n");

			const csvContent = csvHeader + csvRows;

			// Generate filename
			const fileName = `transactions-${statement.originalFileName.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.csv`;
			const r2Key = `exports/${user.id}/${fileName}`;

			// TODO: fix and replace
			// // Upload CSV to R2
			// const uploadResult = await env.DOCUMENTS_BUCKET.put(r2Key, csvContent, {
			// 	httpMetadata: {
			// 		contentType: "text/csv",
			// 		contentDisposition: `attachment; filename="${fileName}"`,
			// 	},
			// });

			// if (!uploadResult) {
			// 	throw new ORPCError("INTERNAL_SERVER_ERROR", {
			// 		message: "Failed to upload CSV to storage",
			// 	});
			// }

			// Generate pre-signed URL (expires in 1 hour)
			const expiresIn = 3600; // 1 hour
			const expiresAt = new Date(Date.now() + expiresIn * 1000);

			// For R2, generate a direct download URL
			// Note: R2 pre-signed URLs would require AWS S3 SDK or custom implementation
			// This approach uses direct URLs which work for the current setup
			// const downloadUrl = `${env.DOCUMENTS_BUCKET_URL}/${r2Key}`;
			const downloadUrl = "";

			return {
				downloadUrl,
				fileName,
				expiresAt: expiresAt.toISOString(),
			};
		}),

	delete: protectedProcedure
		.route({
			method: "DELETE",
			path: "/bank-statements/{id}",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				params: z.object({
					id: z.coerce
						.number()
						.describe("The ID of the bank statement to delete"),
				}),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;
			const db = createDB();

			const [statement] = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();

						const result = await db
							.select()
							.from(bankStatementSchema.bankStatements)
							.where(eq(bankStatementSchema.bankStatements.id, id))
							.limit(1);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}
						return result;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch bank statement.",
							cause: error,
						});
					}
				},
			);

			if (!statement) {
				throw new ORPCError("NOT_FOUND", {
					message: "Bank statement not found",
				});
			}

			if (statement.userId !== user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Bank statement does not belong to user",
				});
			}

			// Delete the bank statement (transactions will be cascade deleted)
			await Sentry.startSpan(
				{
					name: "DB Delete",
					op: "db.delete",
					attributes: {
						table: getTableConfig(bankStatementSchema.bankStatements).name,
					},
				},
				async () => {
					const deleteStartTime = performance.now();
					try {
						await db
							.delete(bankStatementSchema.bankStatements)
							.where(eq(bankStatementSchema.bankStatements.id, id));
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to delete bank statement.",
							cause: error,
						});
					}

					const span = Sentry.getActiveSpan();
					if (span) {
						span.setAttribute(
							"db.delete.processing_time_ms",
							performance.now() - deleteStartTime,
						);
					}
				},
			);
		}),
};
