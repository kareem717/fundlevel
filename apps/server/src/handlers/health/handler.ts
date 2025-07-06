import { OpenAPIHono } from "@hono/zod-openapi";
import { createDB } from "@server/lib/utils/db";
import { sql } from "drizzle-orm";
import { healthRoutes } from "./routes";

export const healthHandler = () =>
	new OpenAPIHono().openapi(healthRoutes.healthCheck, async (c) => {
		const db = createDB();
		let isHealthy = true;
		let dbConnected = false;

		try {
			await db.execute(sql<number>`SELECT 1`);
			dbConnected = true;
		} catch (error) {
			isHealthy = false;
		}

		return c.json({ isHealthy, dbConnected }, isHealthy ? 200 : 500);
	});
