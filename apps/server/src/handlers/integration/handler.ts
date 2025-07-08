import { integrationSchema } from "@fundlevel/db/schema";
import type { NangoConnection } from "@fundlevel/db/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { NangoRecord, NangoWebhookBody } from "@nangohq/node";
import * as Sentry from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { HTTPException } from "hono/http-exception";
import { createDB } from "@/lib/db/client";
import { createNangoClient } from "@/lib/nango/client";
import { getQuickbookAccounts } from "@/lib/nango/quickbooks";
import { NangoIntegration, type QuickbooksAccount } from "@/lib/nango/types";
import { getAuth } from "@/middleware/with-auth";
import { integrationRoutes } from "./routes";

export const integrationHandler = () =>
	new OpenAPIHono()
		.openapi(integrationRoutes.sessionToken, async (c) => {
			const { user } = getAuth(c);
			if (!user) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const db = createDB();
			let existingConnections: NangoConnection[] = [];
			try {
				existingConnections = await Sentry.startSpan(
					{
						name: "DB Query",
						op: "db.query",
						attributes: {
							table: getTableConfig(integrationSchema.nangoConnections).name,
						},
					},
					async () => {
						const queryStartTime = performance.now();
						const connections = await db
							.select()
							.from(integrationSchema.nangoConnections)
							.where(
								eq(
									integrationSchema.nangoConnections.userId,
									Number.parseInt(user.id),
								),
							);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
							span.setAttribute("db.query.records_found", connections.length);
						}
						return connections;
					},
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
				const { integration } = c.req.valid("param");
				const res = await nangoClient.createConnectSession({
					end_user: {
						id: user.id,
						email: user.email,
						display_name: user.name,
					},
					allowed_integrations: [integration],
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
		.openapi(integrationRoutes.webhook, async (c) => {
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

			switch (body.type) {
				case "auth":
					if (!body.endUser?.endUserId) {
						throw new HTTPException(400, {
							message: "Missing end user ID",
						});
					}

					switch (body.operation) {
						case "creation":
							try {
								await Sentry.startSpan(
									{
										name: "DB Insert",
										op: "db.insert",
										attributes: {
											table: getTableConfig(integrationSchema.nangoConnections)
												.name,
										},
									},
									async () => {
										const insertStartTime = performance.now();
										const db = createDB();
										await db.insert(integrationSchema.nangoConnections).values({
											id: body.connectionId,
											provider: body.provider,
											providerConfigKey: body.providerConfigKey,
											userId: Number.parseInt(body.endUser?.endUserId!),
										});

										const span = Sentry.getActiveSpan();
										if (span) {
											span.setAttribute(
												"db.insert.processing_time_ms",
												performance.now() - insertStartTime,
											);
											span.setAttribute("db.insert.provider", body.provider);
										}
									},
								);

								const response = c.json({ success: true as const }, 200);

								return response;
							} catch (error) {
								throw new HTTPException(500, {
									message: "Failed to insert Nango connection",
									cause: error,
								});
							}
						default:
							throw new HTTPException(400, {
								message: "Invalid operation",
							});
					}
				case "sync":
					throw new HTTPException(501, {
						message: "The `sync` webhook is not implemented",
					});
				default:
					throw new HTTPException(400, { message: "Invalid webhook type" });
			}
		})
		.openapi(integrationRoutes.quickbooks.getAccounts, async (c) => {
			const { user } = getAuth(c);
			if (!user) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const { connectionId } = c.req.valid("param");

			let userId: number;
			try {
				userId = Number.parseInt(user.id);
			} catch (error) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const db = createDB();
			let connection: NangoConnection;
			try {
				connection = await Sentry.startSpan(
					{
						name: "DB Query",
						op: "db.query",
						attributes: {
							table: getTableConfig(integrationSchema.nangoConnections).name,
						},
					},
					async () => {
						const queryStartTime = performance.now();
						const [existingConnection] = await db
							.select()
							.from(integrationSchema.nangoConnections)
							.where(
								and(
									eq(integrationSchema.nangoConnections.userId, userId),
									eq(integrationSchema.nangoConnections.id, connectionId),
								),
							);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
						}

						if (!existingConnection) {
							throw new HTTPException(404, { message: "No connection found" });
						}
						return existingConnection;
					},
				);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw new HTTPException(500, {
					message: "Failed to get connection",
					cause: error,
				});
			}

			const accounts = await getQuickbookAccounts(connection.id);

			return c.json({ accounts }, 200);
		});
