import { createDB } from "@fundlevel/api/lib/db/client";
import { createNangoClient } from "@fundlevel/api/lib/nango/client";
import { getQuickbookAccounts } from "@fundlevel/api/lib/nango/quickbooks";
import { QuickbooksAccountSchema } from "@fundlevel/api/lib/nango/schema";
import { NangoIntegration } from "@fundlevel/api/lib/nango/types";
import { integrationSchema } from "@fundlevel/db/schema";
import type { NangoConnection } from "@fundlevel/db/types";
import { SelectNangoConnectionSchema } from "@fundlevel/db/validation";
import type { NangoWebhookBody } from "@nangohq/node";
import { ORPCError } from "@orpc/server";
import * as Sentry from "@sentry/bun";
import { and, eq, sql } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../init";

export const integrationRouter = {
	webhook: publicProcedure
		.route({
			method: "POST",
			path: "/integrations/webhook",
			inputStructure: "detailed",
			tags: ["Integrations"],
		})
		.input(
			z.object({
				headers: z.object({
					"x-nango-signature": z
						.string()
						.base64()
						.describe("The Nango signature"),
				}),
				body: z.any().describe("The body of the webhook"),
			}),
		)
		.output(
			z.object({
				success: z
					.boolean()
					.describe("Whether the webhook was processed successfully"),
			}),
		)
		.handler(async ({ input }) => {
			const db = createDB();
			const nangoClient = createNangoClient();
			const valid = nangoClient.verifyWebhookSignature(
				input.headers["x-nango-signature"],
				input.body,
			);

			if (!valid) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Invalid webhook signature",
				});
			}

			const body = input.body as NangoWebhookBody;

			switch (body.type) {
				case "auth": {
					const userId = body.endUser?.endUserId;
					if (!userId) {
						throw new ORPCError("BAD_REQUEST", {
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
											userId,
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

								return { success: true as const };
							} catch (error) {
								throw new ORPCError("INTERNAL_SERVER_ERROR", {
									message: "Failed to insert Nango connection",
									cause: error,
								});
							}
						default:
							throw new ORPCError("BAD_REQUEST", {
								message: "Invalid operation",
							});
					}
				}
				case "sync":
					throw new ORPCError("NOT_IMPLEMENTED", {
						message: "The `sync` webhook is not implemented",
					});
				default:
					throw new ORPCError("BAD_REQUEST", {
						message: "Invalid webhook type",
					});
			}
		}),
	connections: protectedProcedure
		.route({
			method: "GET",
			path: "/integrations/connections",
			tags: ["Integrations"],
		})
		.output(
			z.object({
				connections: SelectNangoConnectionSchema.array().describe(
					"The Nango connections for the user",
				),
			}),
		)
		.handler(async ({ input, context }) => {
			const db = createDB();
			let connections: NangoConnection[] = [];
			try {
				connections = await Sentry.startSpan(
					{
						name: "DB Query",
						op: "db.query",
						attributes: {
							table: getTableConfig(integrationSchema.nangoConnections).name,
						},
					},
					async () => {
						const queryStartTime = performance.now();
						const result = await db
							.select()
							.from(integrationSchema.nangoConnections)
							.where(
								eq(integrationSchema.nangoConnections.userId, context.user.id),
							);

						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
							span.setAttribute("db.query.records_found", result.length);
						}
						return result;
					},
				);
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to get connections.",
					cause: error,
				});
			}

			return { connections };
		}),
	sessionToken: protectedProcedure
		.route({
			method: "POST",
			path: "/integrations/session-token",
			tags: ["Integrations"],
		})
		.input(
			z.object({
				integration: z
					.nativeEnum(NangoIntegration)
					.describe("The integration to create a session token for"),
			}),
		)
		.output(
			z.object({
				sessionToken: z
					.string()
					.describe("The session token for the integration"),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;

			const db = createDB();
			let existingConnections: NangoConnection[] = [];
			existingConnections = await Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(integrationSchema.nangoConnections).name,
					},
				},
				async () => {
					try {
						const queryStartTime = performance.now();
						const connections = await db
							.select()
							.from(integrationSchema.nangoConnections)
							.where(eq(integrationSchema.nangoConnections.userId, user.id));
						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute(
								"db.query.processing_time_ms",
								performance.now() - queryStartTime,
							);
							span.setAttribute("db.query.records_found", connections.length);
						}
						return connections;
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to get existing connections.",
							cause: error,
						});
					}
				},
			);

			if (existingConnections.length >= 3) {
				throw new ORPCError("CONFLICT", {
					message:
						"You have reached the maximum limit of 3 connections for this provider. Please delete at least one connection before creating a new session token.",
				});
			}

			try {
				const nangoClient = createNangoClient();
				const { integration } = input;
				const res = await nangoClient.createConnectSession({
					end_user: {
						id: user.id,
						email: user.email,
						display_name:
							user.firstName && user.lastName
								? `${user.firstName} ${user.lastName}`
								: user.email,
					},
					allowed_integrations: [integration],
				});

				return {
					sessionToken: res.data.token,
				};
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to create connect session token.",
					cause: error,
				});
			}
		}),
	quickbooks: {
		accounts: protectedProcedure
			.route({
				method: "GET",
				path: "/integrations/quickbooks/accounts",
				tags: ["Integrations", "Quickbooks"],
			})
			.input(
				z.object({
					connectionId: z
						.string()
						.describe("The ID of the connection to get accounts for"),
				}),
			)
			.output(
				z.object({
					accounts: QuickbooksAccountSchema.array().describe(
						"The accounts for the connection",
					),
				}),
			)
			.handler(async ({ input, context }) => {
				const { user } = context;

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
										eq(integrationSchema.nangoConnections.userId, user.id),
										eq(
											integrationSchema.nangoConnections.id,
											input.connectionId,
										),
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
								throw new ORPCError("NOT_FOUND", {
									message: "No connection found",
								});
							}
							return existingConnection;
						},
					);
				} catch (error) {
					if (error instanceof ORPCError) {
						throw error;
					}

					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: "Failed to get connection",
						cause: error,
					});
				}

				const accounts = await getQuickbookAccounts(connection.id);

				return { accounts };
			}),
	},
};
