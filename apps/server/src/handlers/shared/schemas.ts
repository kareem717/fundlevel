import { z } from "@hono/zod-openapi";

export const ERROR_RESPONSE_SCHEMA = {
	content: {
		"application/json": {
			schema: z.object({
				message: z.string().describe("Error message"),
			}),
		},
	},
	description: "Error response",
};
