import { env } from "cloudflare:workers";
import { receiptSchema } from "@fundlevel/db/schema";
import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { createDB } from "@/lib/db/client";
import { getAuth } from "@/middleware/with-auth";
import { OCRService } from "@/services/ocr";
import { receiptRoutes } from "./routes";

export const receiptHandler = () =>
	new OpenAPIHono()
		.openapi(receiptRoutes.list, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const db = createDB();

			try {
				const receipts = await db
					.select()
					.from(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.userId, user.id))
					.orderBy(receiptSchema.receipts.createdAt);

				return c.json(receipts, 200);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to fetch receipts.",
					cause: error,
				});
			}
		})
		.openapi(receiptRoutes.upload, async (c) => {
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
					`receipts/${new Date().toISOString()}-${crypto.randomUUID()}`,
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

			// Create receipt record
			try {
				const [receipt] = await db
					.insert(receiptSchema.receipts)
					.values({
						originalFileName: file.name,
						r2Url: fileUrl,
						fileType: file.type,
						fileSize: file.size.toString(),
						userId: user.id,
						processingStatus: "pending",
					})
					.returning();

				return c.json(receipt, 201);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to create receipt record.",
					cause: error,
				});
			}
		})
		.openapi(receiptRoutes.extract, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Get the receipt
				const [receipt] = await db
					.select()
					.from(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)))
					.limit(1);

				if (!receipt) {
					throw new HTTPException(404, { message: "Receipt not found" });
				}

				if (receipt.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Update status to processing
				await db
					.update(receiptSchema.receipts)
					.set({
						processingStatus: "processing",
						updatedAt: new Date(),
					})
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)));

				try {
					// Extract receipt items
					const extractedData = await ocrService.extractReceiptItems({
						fileUrl: receipt.r2Url,
						fileType: receipt.fileType,
						userId: user.id,
						receiptId: receipt.id,
					});

					// Update status to completed
					await db
						.update(receiptSchema.receipts)
						.set({
							processingStatus: "completed",
							updatedAt: new Date(),
						})
						.where(eq(receiptSchema.receipts.id, Number.parseInt(id)));

					return c.json(
						{
							success: true,
							itemsExtracted: extractedData.items.length,
							metadata: extractedData.metadata,
							items: extractedData.items,
						},
						200,
					);
				} catch (error) {
					// Update status to failed
					await db
						.update(receiptSchema.receipts)
						.set({
							processingStatus: "failed",
							updatedAt: new Date(),
						})
						.where(eq(receiptSchema.receipts.id, Number.parseInt(id)));

					throw error;
				}
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to extract receipt items.",
					cause: error,
				});
			}
		})
		.openapi(receiptRoutes.items, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Check if the receipt belongs to the user
				const [receipt] = await db
					.select()
					.from(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)))
					.limit(1);

				if (!receipt) {
					throw new HTTPException(404, { message: "Receipt not found" });
				}

				if (receipt.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Get items for this receipt
				const items = await ocrService.getReceiptItemsByReceipt(
					Number.parseInt(id),
				);

				return c.json(items, 200);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to fetch receipt items.",
					cause: error,
				});
			}
		})
		.openapi(receiptRoutes.exportCsv, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();
			const ocrService = new OCRService();

			try {
				// Check if the receipt belongs to the user
				const [receipt] = await db
					.select()
					.from(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)))
					.limit(1);

				if (!receipt) {
					throw new HTTPException(404, { message: "Receipt not found" });
				}

				if (receipt.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Get items for this receipt
				const items = await ocrService.getReceiptItemsByReceipt(
					Number.parseInt(id),
				);

				if (items.length === 0) {
					throw new HTTPException(400, {
						message: "No items to export",
					});
				}

				// Generate CSV content
				const csvHeader = "Item,Quantity,Unit Price,Total Price,Category\n";
				const csvRows = items
					.map((item) => {
						const unitPrice = (item.unitPriceCents / 100).toFixed(2);
						const totalPrice = (item.totalPriceCents / 100).toFixed(2);

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
							escapeCsvField(item.name),
							item.quantity,
							unitPrice,
							totalPrice,
							escapeCsvField(item.category || ""),
						].join(",");
					})
					.join("\n");

				const csvContent = csvHeader + csvRows;

				// Generate filename
				const fileName = `receipt-items-${receipt.originalFileName.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.csv`;
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
		.openapi(receiptRoutes.delete, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { user } = session;
			const { id } = c.req.valid("param");
			const db = createDB();

			try {
				// Check if the receipt belongs to the user
				const [receipt] = await db
					.select()
					.from(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)))
					.limit(1);

				if (!receipt) {
					throw new HTTPException(404, { message: "Receipt not found" });
				}

				if (receipt.userId !== user.id) {
					throw new HTTPException(403, { message: "Access denied" });
				}

				// Delete the receipt (cascade will handle receipt items)
				await db
					.delete(receiptSchema.receipts)
					.where(eq(receiptSchema.receipts.id, Number.parseInt(id)));

				return c.json(
					{
						success: true,
						message: "Receipt deleted successfully",
					},
					200,
				);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}
				throw new HTTPException(500, {
					message: "Failed to delete receipt.",
					cause: error,
				});
			}
		});
