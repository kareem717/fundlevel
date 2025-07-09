import { createRoute, z } from "@hono/zod-openapi";
import {
	ERROR_RESPONSE_SCHEMA,
	REDIRECT_RESPONSE_SCHEMA,
} from "../shared/schemas";

export const authRoutes = {
	signIn: createRoute({
		method: "get",
		path: "/sign-in",
		tags: ["Auth"],
		security: [{}],
		responses: {
			200: {
				...REDIRECT_RESPONSE_SCHEMA,
				description: "Redirect to WorkOS sign-in page",
			},
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	callback: createRoute({
		method: "get",
		path: "/callback",
		tags: ["Auth"],
		security: [{}],
		request: {
			query: z.object({
				code: z.string(),
			}),
		},
		responses: {
			200: {
				...REDIRECT_RESPONSE_SCHEMA,
				description: "Redirect after successful authentication",
			},
			500: ERROR_RESPONSE_SCHEMA,
		},
		hide: true,
	}),
};
