import { createDB } from "@fundlevel/api/lib/db/client";
import * as Sentry from "@sentry/bun";
import { sql } from "drizzle-orm";
import z from "zod";
import { publicProcedure } from "../init";

export const healthRouter = {
	check: publicProcedure
		.output(
			z.object({
				isHealthy: z.boolean().describe("Whether the API is healthy"),
				dbConnected: z
					.boolean()
					.describe("Whether the database pinged successfully"),
			}),
		)
		.route({
			method: "GET",
			path: "/health/check",
			tags: ["Health"],
		})
		.handler(async () => {
			const db = createDB();

			return await Sentry.startSpan(
				{
					name: "Health Check",
					op: "health.check",
				},
				async (span) => {
					let isHealthy = true;
					let dbConnected = false;
					const startTime = performance.now();

					try {
						await db.execute(sql<number>`SELECT 1`);

						dbConnected = true;
					} catch (_error) {
						//TODO: handler error
						isHealthy = false;
					}

					span?.setAttribute(
						"health.check.db_ping_time_ms",
						performance.now() - startTime,
					);
					span?.setAttribute("health.check.db_ping_success", dbConnected);

					return { isHealthy, dbConnected };
				},
			);
		}),
};
