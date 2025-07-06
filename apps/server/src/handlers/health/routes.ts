import { createRoute, z } from "@hono/zod-openapi";
import { ERROR_RESPONSE_SCHEMA } from "../shared/schemas";

export const healthRoutes = {
	healthCheck: createRoute({
		method: "get",
		path: "/",
		tags: ["Health"],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							isHealthy: z.boolean(),
							dbConnected: z.boolean(),
						}),
					},
				},
				description: "Healthy service",
			},
			500: {
				content: {
					"application/json": {
						schema: z.object({
							isHealthy: z.boolean(),
							dbConnected: z.boolean(),
						}),
					},
				},
				description: "Unhealthy service",
			},
		},
	}),
};
