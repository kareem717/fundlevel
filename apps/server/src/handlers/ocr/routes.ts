import { InsertTransactionSchema } from "@fundlevel/db/validation";
import { createRoute, z } from "@hono/zod-openapi";
import { withAuth } from "@/middleware/with-auth";
import { ERROR_RESPONSE_SCHEMA } from "../shared/schemas";

export const TransactionSchema = InsertTransactionSchema.pick({
	date: true,
	amountCents: true,
	merchant: true,
	description: true,
	currency: true,
});

const OcrTransactionSchema = TransactionSchema.extend({
	quickbooksAccount: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
});

export const ocrRoutes = {
	transactions: createRoute({
		method: "post",
		path: "/transactions",
		tags: ["OCR"],
		description: "Process an image",
		middleware: [withAuth()],
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
								.describe("The image file"),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(OcrTransactionSchema),
						description: "The processed transactions",
					},
				},
				description: "Result of the OCR process",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
};
