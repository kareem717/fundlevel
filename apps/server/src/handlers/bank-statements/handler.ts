import { env } from "cloudflare:workers";
import { bankStatementSchema } from "@fundlevel/db/schema";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { createDB } from "@/lib/db/client";
import { getAuth } from "@/middleware/with-auth";
import { OCRService } from "@/services/ocr";
import { bankStatementRoutes } from "./routes";

export const bankStatementHandler = () =>
	new OpenAPIHono()
		.openapi(bankStatementRoutes.list, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const db = createDB();

			try {
				const statements = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.userId, user.id))
					.orderBy(bankStatementSchema.bankStatements.createdAt);

				return c.json(statements, 200);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to fetch bank statements.",
					cause: error,
				});
			}
		})
		.openapi(bankStatementRoutes.upload, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { file } = await c.req.valid("form");
			const db = createDB();

			// Upload file to R2
			let fileUrl: string;
			let uploadedFile: R2Object;
			try {
				uploadedFile = await env.DOCUMENTS_BUCKET.put(
					`${new Date().toISOString()}-${crypto.randomUUID()}`,
					file,
					{
						httpMetadata: {
							contentType: file.type,
						},
					},
				);
				if (!uploadedFile) {
					throw new HTTPException(500, {
						message: "Initializing file upload to R2 failed.",
					});
				}
				fileUrl = `${env.DOCUMENTS_BUCKET_URL}/${uploadedFile.key}`;
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to upload file to R2.",
					cause: error,
				});
			}

			// Create bank statement record
			try {
				const [bankStatement] = await db
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

				return c.json(bankStatement, 201);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to create bank statement record.",
					cause: error,
				});
			}
		})
		.openapi(bankStatementRoutes.extract, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Get the bank statement
				const [statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)))
					.limit(1);

				if (!statement) {
					throw new HTTPException(404, { message: "Bank statement not found" });
				}

				if (statement.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Update status to processing
				await db
					.update(bankStatementSchema.bankStatements)
					.set({
						processingStatus: "processing",
						updatedAt: new Date(),
					})
					.where(
						eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
					);

				try {
					// Extract transactions
					const transactions = await ocrService.extractTransactions({
						fileUrl: statement.r2Url,
						fileType: statement.fileType,
						userId: user.id,
						bankStatementId: statement.id,
					});

					// Update status to completed
					await db
						.update(bankStatementSchema.bankStatements)
						.set({
							processingStatus: "completed",
							updatedAt: new Date(),
						})
						.where(
							eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
						);

					return c.json(
						{
							success: true,
							transactionsExtracted: transactions.length,
							transactions,
						},
						200,
					);
				} catch (error) {
					// Update status to failed
					await db
						.update(bankStatementSchema.bankStatements)
						.set({
							processingStatus: "failed",
							updatedAt: new Date(),
						})
						.where(
							eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
						);

					throw error;
				}
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to extract transactions.",
					cause: error,
				});
			}
		})
		.openapi(bankStatementRoutes.transactions, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Check if the bank statement belongs to the user
				const [statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)))
					.limit(1);

				if (!statement) {
					throw new HTTPException(404, { message: "Bank statement not found" });
				}

				if (statement.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Get transactions for this bank statement
				const transactions = await ocrService.getTransactionsByBankStatement(
					Number.parseInt(id),
				);

				return c.json(transactions, 200);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to fetch transactions.",
					cause: error,
				});
			}
		})
		.openapi(bankStatementRoutes.exportCsv, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Check if the bank statement belongs to the user
				const [statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)))
					.limit(1);

				if (!statement) {
					throw new HTTPException(404, { message: "Bank statement not found" });
				}

				if (statement.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Get transactions for this bank statement
				const transactions = await ocrService.getTransactionsByBankStatement(
					Number.parseInt(id),
				);

				if (transactions.length === 0) {
					throw new HTTPException(400, {
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

				// Upload CSV to R2
				const uploadResult = await env.DOCUMENTS_BUCKET.put(r2Key, csvContent, {
					httpMetadata: {
						contentType: "text/csv",
						contentDisposition: `attachment; filename="${fileName}"`,
					},
				});

				if (!uploadResult) {
					throw new HTTPException(500, {
						message: "Failed to upload CSV to storage",
					});
				}

				// Generate pre-signed URL (expires in 1 hour)
				const expiresIn = 3600; // 1 hour
				const expiresAt = new Date(Date.now() + expiresIn * 1000);

				// For R2, generate a direct download URL
				// Note: R2 pre-signed URLs would require AWS S3 SDK or custom implementation
				// This approach uses direct URLs which work for the current setup
				const downloadUrl = `${env.DOCUMENTS_BUCKET_URL}/${r2Key}`;

				return c.json(
					{
						downloadUrl,
						fileName,
						expiresAt: expiresAt.toISOString(),
					},
					200,
				);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to export CSV.",
					cause: error,
				});
			}
		})
		.openapi(bankStatementRoutes.delete, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();

			try {
				// Check if the bank statement belongs to the user
				const [statement] = await db
					.select()
					.from(bankStatementSchema.bankStatements)
					.where(eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)))
					.limit(1);

				if (!statement) {
					throw new HTTPException(404, { message: "Bank statement not found" });
				}

				if (statement.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Delete the bank statement (transactions will be cascade deleted)
				await db
					.delete(bankStatementSchema.bankStatements)
					.where(
						eq(bankStatementSchema.bankStatements.id, Number.parseInt(id)),
					);

				return c.json({ success: true }, 200);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to delete bank statement.",
					cause: error,
				});
			}
		});
