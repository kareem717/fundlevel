import { createRoute, z } from "@hono/zod-openapi";
import { withAuth } from "@/middleware/with-auth";
import { ERROR_RESPONSE_SCHEMA } from "../shared/schemas";

export const ocrRoutes = {
	process: createRoute({
		method: "post",
		path: "/process",
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
						schema: z
							.array(
								z.object({
									index: z.number().describe("The index of the page"),
									markdown: z
										.string()
										.describe("The extracted markdown of the page"),
								}),
							)
							.describe("The processed pages of the document"),
					},
				},
				description: "Result of the OCR process",
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
};
