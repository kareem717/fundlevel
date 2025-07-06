import { z } from "@hono/zod-openapi";

export const ERROR_RESPONSE_SCHEMA = {
	content: {
		"application/json": {
			schema: z.object({
				message: z.string().describe("Error message"),
				status: z.number().describe("Error status code"),
			}),
		},
	},
	description: "Error response",
};
