import {
	SelectBankStatementSchema,
	SelectTransactionSchema,
} from "@fundlevel/db/validation";
import { createRoute, z } from "@hono/zod-openapi";
import { withAuth } from "@/middleware/with-auth";
import { ERROR_RESPONSE_SCHEMA } from "../shared/schemas";

export const bankStatementRoutes = {
	list: createRoute({
		method: "get",
		path: "/",
		tags: ["Bank Statements"],
		description: "List all bank statements for the authenticated user",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(SelectBankStatementSchema),
						description: "List of bank statements",
					},
				},
				description: "Bank statements retrieved successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	upload: createRoute({
		method: "post",
		path: "/upload",
		tags: ["Bank Statements"],
		description: "Upload a bank statement file",
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
								.describe("The bank statement file"),
						}),
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: SelectBankStatementSchema,
						description: "The uploaded bank statement",
					},
				},
				description: "Bank statement uploaded successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	extract: createRoute({
		method: "post",
		path: "/{id}/extract",
		tags: ["Bank Statements"],
		description: "Extract transactions from a bank statement using OCR",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the bank statement to extract from"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							transactionsExtracted: z.number(),
							transactions: z.array(z.any()),
						}),
						description: "Extraction result",
					},
				},
				description: "Transactions extracted successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	transactions: createRoute({
		method: "get",
		path: "/{id}/transactions",
		tags: ["Bank Statements"],
		description: "Get all transactions for a bank statement",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the bank statement"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(SelectTransactionSchema),
						description: "List of transactions",
					},
				},
				description: "Transactions retrieved successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	exportCsv: createRoute({
		method: "post",
		path: "/{id}/export-csv",
		tags: ["Bank Statements"],
		description: "Export transactions to CSV and get download URL",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the bank statement"),
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
						description: "CSV export result",
					},
				},
				description: "CSV export created successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	delete: createRoute({
		method: "delete",
		path: "/{id}",
		tags: ["Bank Statements"],
		description: "Delete a bank statement",
		middleware: [withAuth()],
		security: [{ apiKeyCookie: [] }],
		request: {
			params: z.object({
				id: z.string().describe("The ID of the bank statement to delete"),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
						}),
						description: "Deletion result",
					},
				},
				description: "Bank statement deleted successfully",
			},
			403: ERROR_RESPONSE_SCHEMA,
			404: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
};
