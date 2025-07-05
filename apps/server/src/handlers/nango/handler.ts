import { connections } from "@fundlevel/db/schema";
import type { NangoConnection } from "@fundlevel/db/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { NangoWebhookBody } from "@nangohq/node";
import { createDB } from "@server/lib/utils/db";
import { createNangoClient, NangoIntegration } from "@server/lib/utils/nango";
import { getAuth } from "@server/middleware/with-auth";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { nangoRoutes } from "./routes";

export const nangoHandler = () =>
	new OpenAPIHono()
		.openapi(nangoRoutes.sessionToken, async (c) => {
			const { user } = getAuth(c);
			if (!user) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}
			const db = createDB();
			let existingConnections: NangoConnection[] = [];
			try {
				// Check if user already has 3 or more connections for this provider config key
				existingConnections = await db
					.select()
					.from(connections.nangoConnections)
					.where(
						eq(connections.nangoConnections.userId, Number.parseInt(user.id)),
					);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to get existing connections.",
					cause: error,
				});
			}

			if (existingConnections.length >= 3) {
				throw new HTTPException(409, {
					message:
						"You have reached the maximum limit of 3 connections for this provider. Please delete at least one connection before creating a new session token.",
				});
			}

			try {
				const nangoClient = createNangoClient();
				const res = await nangoClient.createConnectSession({
					end_user: {
						id: user.id,
						email: user.email,
						display_name: user.name,
					},
					allowed_integrations: [
						NangoIntegration.QUICKBOOKS_SANDBOX,
						NangoIntegration.QUICKBOOKS,
					],
				});

				return c.json(
					{
						sessionToken: res.data.token,
					},
					200,
				);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to create connect session token.",
					cause: error,
				});
			}
		})
		.openapi(nangoRoutes.webhook, async (c) => {
			const signature = c.req.valid("header")["x-nango-signature"];
			const nangoClient = createNangoClient();
			const valid = nangoClient.verifyWebhookSignature(
				signature,
				await c.req.json(),
			);

			if (!valid) {
				throw new HTTPException(401, {
					message: "Invalid webhook signature",
				});
			}

			const body = (await c.req.json()) as NangoWebhookBody;

			// TODO: add business logic here, e.g. updating DB, queuing jobs, etc.
			switch (body.type) {
				case "auth":
					if (!body.endUser?.endUserId) {
						throw new HTTPException(400, { message: "Missing end user ID" });
					}

					switch (body.operation) {
						case "creation":
							try {
								const db = createDB();
								await db.insert(connections.nangoConnections).values({
									id: body.connectionId,
									provider: body.provider,
									providerConfigKey: body.providerConfigKey,
									userId: Number.parseInt(body.endUser?.endUserId),
								});
								return c.json({ success: true as const }, 200);
							} catch (error) {
								throw new HTTPException(500, {
									message: "Failed to insert Nango connection",
									cause: error,
								});
							}
						default:
							throw new HTTPException(400, { message: "Invalid operation" });
					}
				case "sync":
					throw new HTTPException(501, {
						message: "The `sync` webhook is not implemented",
					});
				default:
					throw new HTTPException(400, { message: "Invalid webhook type" });
			}
		});
