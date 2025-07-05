import { OpenAPIHono } from "@hono/zod-openapi";
import { createDB } from "@server/lib/utils/db";
import { sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { healthRoutes } from "./routes";

export const healthHandler = () =>
	new OpenAPIHono().openapi(healthRoutes.healthCheck, async (c) => {
		const db = createDB();

		try {
			await db.execute(sql<number>`SELECT 1`);
			return c.json({ status: "ok" as const }, 200);
		} catch (error) {
			throw new HTTPException(500, {
				message: "Database connection failed",
				cause: error,
			});
		}
	});
