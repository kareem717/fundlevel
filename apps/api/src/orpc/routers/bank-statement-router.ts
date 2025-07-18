import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@fundlevel/api/env";
import { createDB } from "@fundlevel/api/lib/db/client";
import {
	bankStatementS3Key,
	createS3Client,
	exportS3Key,
} from "@fundlevel/api/lib/s3/client";
import { bankStatementSchema, transactionSchema } from "@fundlevel/db/schema";
import type { BankStatement } from "@fundlevel/db/types";
import {
	SelectBankStatementSchema,
	SelectTransactionSchema,
} from "@fundlevel/db/validation";
import { extractBankStatement } from "@fundlevel/jobs/tasks";
import { ORPCError } from "@orpc/server";
import * as Sentry from "@sentry/bun";
import { runs } from "@trigger.dev/sdk/v3";
import { and, eq } from "drizzle-orm";
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
			path: "/bank-statements",
			spec: {
				tags: ["Bank Statements"],
				requestBody: {
					required: true,
					content: {
						"multipart/form-data": {
							schema: {
								type: "object",
								properties: {
									file: {
										type: "string",
										format: "binary",
										description:
											"The bank statement file to extract transactions from (PDF, CSV, or other supported formats)",
									},
								},
								required: ["file"],
							},
						},
					},
				},
			},
		})
		.input(
			z.object({
				file: z
					.instanceof(File)
					.refine(
						(file) =>
							["image/png", "image/jpeg", "application/pdf"].includes(
								file.type,
							),
						{
							message: "File must be a PNG, JPEG, or PDF",
						},
					),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { file } = input;
			const db = createDB();
			const s3Client = createS3Client();
			const s3Key = bankStatementS3Key(user.id, file.name);

			await db.transaction(async (tx) => {
				try {
					await tx.insert(bankStatementSchema.bankStatements).values({
						originalFileName: file.name,
						s3Key,
						fileType: file.type,
						fileSizeBytes: BigInt(file.size),
						userId: user.id,
					});
				} catch (error) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: "Failed to insert bank statement.",
						cause: error,
					});
				}

				try {
					// Convert File to Buffer to avoid streaming hash calculation issues
					const fileBuffer = Buffer.from(await file.arrayBuffer());

					await s3Client.send(
						new PutObjectCommand({
							Bucket: env.BUCKET_NAME,
							Key: s3Key,
							Body: fileBuffer,
						}),
					);
				} catch (error) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: "Failed to save bank statement to storage.",
						cause: error,
					});
				}
			});
		}),
	download: protectedProcedure
		.route({
			method: "GET",
			path: "/bank-statements/{id}/download",
			tags: ["Bank Statements"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				params: z.object({
					id: z.coerce
						.number()
						.describe("The ID of the bank statement to download"),
				}),
			}),
		)
		.output(
			z.object({
				downloadUrl: z.string().describe("The URL of the bank statement file"),
				expiresAt: z
					.string()
					.datetime()
					.describe("The date and time the URL will expire"),
				expiresIn: z
					.number()
					.describe("The number of seconds the URL will expire in"),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;
			const db = createDB();
			const s3Client = createS3Client();

			let statement: BankStatement;
			try {
				[statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, id));
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to fetch bank statement.",
					cause: error,
				});
			}

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

			const expiresIn = 60 * 60 * 24; // 24 hours

			const presignedUrl = await getSignedUrl(
				s3Client,
				new GetObjectCommand({
					Bucket: env.BUCKET_NAME,
					Key: statement.s3Key,
				}),
				{
					expiresIn,
				},
			);

			return {
				downloadUrl: presignedUrl,
				expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
				expiresIn,
			};
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
					id: z.coerce
						.number()
						.describe("The ID of the bank statement to extract"),
				}),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;
			const db = createDB();
			const s3Client = createS3Client();

			let statement: BankStatement;
			try {
				[statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, input.params.id));
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to fetch bank statement.",
					cause: error,
				});
			}
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

			if (statement.extractionJobId) {
				// check if the job is completed
				const job = await runs.retrieve(statement.extractionJobId);
				if (["COMPLETED", "QUEUED", "DELAYED"].includes(job.status ?? "")) {
					throw new ORPCError("BAD_REQUEST", {
						message: `Bank statement processing already been ${job.status?.toLowerCase()}`,
					});
				}
			}

			// // Get QB connection for account classification
			// const nangoConnection = await Sentry.startSpan(
			// 	{
			// 		name: "DB Query",
			// 		op: "db.query",
			// 		attributes: {
			// 			table: getTableConfig(integrationSchema.nangoConnections).name,
			// 		},
			// 	},
			// 	async () => {
			// 		let nangoConnection: NangoConnection;
			// 		const queryStartTime = performance.now();
			// 		try {
			// 			[nangoConnection] = await db
			// 				.select()
			// 				.from(integrationSchema.nangoConnections)
			// 				.where(eq(integrationSchema.nangoConnections.userId, user.id))
			// 				.limit(1);
			// 		} catch (error) {
			// 			throw new ORPCError("INTERNAL_SERVER_ERROR", {
			// 				message: "Failed to fetch nango connection.",
			// 				cause: error,
			// 			});
			// 		}
			// 		const span = Sentry.getActiveSpan();
			// 		if (span) {
			// 			span.setAttribute(
			// 				"db.query.processing_time_ms",
			// 				performance.now() - queryStartTime,
			// 			);
			// 		}

			// 		if (!nangoConnection) {
			// 			throw new ORPCError("NOT_FOUND", {
			// 				message: "Nango connection not found",
			// 			});
			// 		}

			// 		return nangoConnection;
			// 	},
			// );

			// create presigned url for bank statement
			const presignedUrl = await Sentry.startSpan(
				{
					name: "S3 Get Object",
					op: "s3.get_object",
				},
				async () => {
					try {
						const getUrlStartTime = performance.now();
						const url = await getSignedUrl(
							s3Client,
							new GetObjectCommand({
								Bucket: env.BUCKET_NAME,
								Key: statement.s3Key,
							}),
							{
								expiresIn: 60, // 60 seconds
							},
						);
						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"s3.get_object.processing_time_ms",
								performance.now() - getUrlStartTime,
							);
						}

						return url;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to create presigned url.",
							cause: error,
						});
					}
				},
			);

			// let accounts: NangoRecord<QuickbooksAccount>[] = [];
			// if (nangoConnection) {
			// 	try {
			// 		accounts = await getQuickbookAccounts(
			// 			nangoConnection.id,
			// 			nangoConnection.providerConfigKey,
			// 		);
			// 	} catch (error) {
			// 		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			// 			message: "Failed to fetch quickbooks accounts.",
			// 			cause: error,
			// 		});
			// 	}
			// }

			const jobRes = await extractBankStatement.trigger({
				userId: user.id,
				bankStatementId: statement.id,
				url: presignedUrl,
				mimeType: statement.fileType,
				fileName: statement.originalFileName,
			});

			try {
				// TODO: we don't wanna store this, it expires in 15 min
				await db
					.update(bankStatementSchema.bankStatements)
					.set({
						extractionJobId: jobRes.id,
						extractionJobToken: jobRes.publicAccessToken,
					})
					.where(eq(bankStatementSchema.bankStatements.id, statement.id));
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to update bank statement.",
					cause: error,
				});
			}

			return jobRes;
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
			const csvHeader = "Date,Merchant,Description,Credit,Debit,Currency\n";
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
						transaction.amountCents > 0 ? amount : "",
						transaction.amountCents < 0 ? amount : "",
						transaction.currency || "USD",
					].join(",");
				})
				.join("\n");

			const csvContent = csvHeader + csvRows;

			// Generate filename
			const fileName = `transactions-${statement.originalFileName.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.csv`;
			const s3Key = exportS3Key(user.id, fileName);

			// TODO: fix and replace
			// Upload CSV to s3
			const s3Client = createS3Client();
			const command = new PutObjectCommand({
				Bucket: env.BUCKET_NAME,
				Key: s3Key,
				Body: csvContent,
				Metadata: {
					contentType: "text/csv",
					contentDisposition: `attachment; filename="${fileName}"`,
				},
			});

			try {
				await s3Client.send(command);
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to upload CSV to storage",
					cause: error,
				});
			}

			const expiresIn = 3600; // 15 minutes

			try {
				const downloadUrl = await getSignedUrl(
					s3Client,
					new GetObjectCommand({
						Bucket: env.BUCKET_NAME,
						Key: s3Key,
					}),
					{
						expiresIn,
					},
				);
				return {
					downloadUrl,
					fileName,
					expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
				};
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to generate download URL",
					cause: error,
				});
			}
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

			await db.transaction(async (tx) => {
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
							await tx
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

				// Delete the CSV file from s3
				const s3Client = createS3Client();

				await Sentry.startSpan(
					{
						name: "S3 Delete",
						op: "s3.delete",
						attributes: {
							bucket: env.BUCKET_NAME,
							key: statement.s3Key,
						},
					},
					async () => {
						try {
							const deleteStartTime = performance.now();
							await s3Client.send(
								new DeleteObjectCommand({
									Bucket: env.BUCKET_NAME,
									Key: statement.s3Key,
								}),
							);

							const span = Sentry.getActiveSpan();
							if (span) {
								span.setAttribute(
									"s3.delete.processing_time_ms",
									performance.now() - deleteStartTime,
								);
							}
						} catch (error) {
							throw new ORPCError("INTERNAL_SERVER_ERROR", {
								message: "Failed to delete CSV file from storage",
								cause: error,
							});
						}
					},
				);
			});
		}),
	get: protectedProcedure
		.route({
			method: "GET",
			path: "/bank-statements/{id}",
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
		.handler(async ({ input, context }) => {
			const { user } = context;
			const { id } = input.params;

			const db = createDB();
			const [statement] = await db
				.select()
				.from(bankStatementSchema.bankStatements)
				.where(eq(bankStatementSchema.bankStatements.id, id));

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

			return {
				statement,
			};
		}),
};
