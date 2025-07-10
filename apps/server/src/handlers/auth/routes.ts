import { createRoute, z } from "@hono/zod-openapi";
import { withAuth } from "@/middleware/with-auth";
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
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
	signOut: createRoute({
		method: "get",
		path: "/sign-out",
		tags: ["Auth"],
		security: [{ CookieAuth: [] }],
		middleware: [withAuth()],
		request: {
			query: z.object({
				redirectUrl: z.string().optional(),
			}),
		},
		responses: {
			200: {
				...REDIRECT_RESPONSE_SCHEMA,
				description: "Redirect to WorkOS sign-out page",
			},
			403: ERROR_RESPONSE_SCHEMA,
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
			308: {
				headers: z.object({
					Location: z.string(),
				}),
				description: "Redirect after successful authentication",
			},
			500: ERROR_RESPONSE_SCHEMA,
		},
		hide: true,
	}),
	session: createRoute({
		method: "get",
		path: "/session",
		tags: ["Auth"],
		security: [{ CookieAuth: [] }],
		middleware: [withAuth()],
		responses: {
			200: {
				description: "Session data",
				content: {
					"application/json": {
						schema: z.object({
							// Derived from @workos-inc/node : AuthenticateWithSessionCookieSuccessResponse
							session: z.object({
								sessionId: z.string(),
								user: z.object({
									object: z.literal("user"),
									id: z.string(),
									email: z.string(),
									emailVerified: z.boolean(),
									profilePictureUrl: z.string().nullable(),
									firstName: z.string().nullable(),
									lastName: z.string().nullable(),
									lastSignInAt: z.string().nullable(),
									createdAt: z.string(),
									updatedAt: z.string(),
									externalId: z.string().nullable(),
									metadata: z.record(z.string()),
								}),
							}),
						}),
					},
				},
			},
			403: ERROR_RESPONSE_SCHEMA,
			500: ERROR_RESPONSE_SCHEMA,
		},
	}),
};
