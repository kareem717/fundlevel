import {
	SelectReceiptItemSchema,
	SelectReceiptSchema,
} from "@fundlevel/db/validation";
import { createRoute, z } from "@hono/zod-openapi";
import { withAuth } from "@/middleware/with-auth";
import { ERROR_RESPONSE_SCHEMA } from "../shared/schemas";

export const receiptRoutes = {
	list: createRoute({
		method: "get",
		path: "/",
		tags: ["Receipts"],
		description: "List all receipts for the authenticated user",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(SelectReceiptSchema),
						description: "List of receipts",
					},
				},
				description: "Receipts retrieved successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	upload: createRoute({
		method: "post",
		path: "/upload",
		tags: ["Receipts"],
		description: "Upload a receipt file",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			body: {
				content: {
					"multipart/form-data": {
						schema: z.object({
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
								.describe("The receipt file"),
						}),
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: SelectReceiptSchema,
						description: "The uploaded receipt",
					},
				},
				description: "Receipt uploaded successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	extract: createRoute({
		method: "post",
		path: "/{id}/extract",
		tags: ["Receipts"],
		description: "Extract line items from a receipt using OCR",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the receipt to extract from"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							itemsExtracted: z.number(),
							metadata: z.object({
								merchantName: z.string().optional(),
								receiptDate: z.string().optional(),
								totalAmountCents: z.number().optional(),
								taxAmountCents: z.number().optional(),
								currency: z.string().optional(),
							}),
							items: z.array(z.any()),
						}),
						description: "Extraction result",
					},
				},
				description: "Receipt items extracted successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	items: createRoute({
		method: "get",
		path: "/{id}/items",
		tags: ["Receipts"],
		description: "Get all items for a receipt",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the receipt"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(SelectReceiptItemSchema),
						description: "List of receipt items",
					},
				},
				description: "Receipt items retrieved successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	exportCsv: createRoute({
		method: "post",
		path: "/{id}/export-csv",
		tags: ["Receipts"],
		description: "Export receipt items to CSV",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the receipt to export"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							downloadUrl: z.string().url(),
							fileName: z.string(),
							expiresAt: z.string(),
						}),
						description: "CSV export download information",
					},
				},
				description: "CSV exported successfully",
			},
			400: ERROR_RESPONSE_SCHEMA,
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	delete: createRoute({
		method: "delete",
		path: "/{id}",
		tags: ["Receipts"],
		description: "Delete a receipt and all its items",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the receipt to delete"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							message: z.string(),
						}),
						description: "Deletion result",
					},
				},
				description: "Receipt deleted successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
};
