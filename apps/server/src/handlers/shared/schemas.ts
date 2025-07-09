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

export const REDIRECT_RESPONSE_SCHEMA = {
	headers: {
		Location: {
			description: "URL to redirect to.",
			schema: { type: "string" as const },
		},
	},
	content: {
		"application/json": {
			schema: z.object({
				redirectUrl: z.string().url(),
				shouldRedirect: z.boolean().default(true),
			}),
		},
	},
};
