import { createDB } from "@fundlevel/api/lib/db/client";
import { createNangoClient } from "@fundlevel/api/lib/nango/client";
import { getQuickbookAccounts } from "@fundlevel/api/lib/nango/quickbooks";
import { QuickbooksAccountSchema } from "@fundlevel/api/lib/nango/schema";
import { integrationSchema } from "@fundlevel/db/schema";
import type { NangoConnection, NangoProviders } from "@fundlevel/db/types";
import {
	NangoProviderSchema,
	SelectNangoConnectionSchema,
} from "@fundlevel/db/validation";
import type { NangoWebhookBody } from "@nangohq/node";
import { ORPCError } from "@orpc/server";
import * as Sentry from "@sentry/bun";
import { and, eq, sql } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import z from "zod";
import { nangoProviders } from "../../../../../packages/db/src/schema/integration";
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

										// try to cast the provider config key to the enum
										const providerConfigKey =
											body.providerConfigKey as NangoProviders;
										if (
											!nangoProviders.enumValues.includes(providerConfigKey)
										) {
											throw new ORPCError("BAD_REQUEST", {
												message: `Invalid provider config key: ${providerConfigKey}`,
											});
										}

										await db.insert(integrationSchema.nangoConnections).values({
											id: body.connectionId,
											provider: body.provider,
											providerConfigKey,
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
	getAll: protectedProcedure
		.route({
			method: "GET",
			path: "/integrations",
			tags: ["Integrations"],
		})
		.output(
			z.object({
				connections: SelectNangoConnectionSchema.array().describe(
					"The Nango connections for the user",
				),
			}),
		)
		.handler(async ({ input, context }) =>
			Sentry.startSpan(
				{
					name: "DB Query",
					op: "db.query",
					attributes: {
						table: getTableConfig(integrationSchema.nangoConnections).name,
					},
				},
				async () => {
					const db = createDB();
					const queryStartTime = performance.now();
					try {
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
						return { connections: result };
					} catch (error) {
						throw new ORPCError("INTERNAL_SERVER_ERROR", {
							message: "Failed to fetch connections.",
							cause: error,
						});
					}
				},
			),
		),
	sessionToken: protectedProcedure
		.route({
			method: "POST",
			path: "/integrations/session-token",
			tags: ["Integrations"],
		})
		.input(
			z.object({
				integration: NangoProviderSchema.describe(
					"The integration to create a session token for",
				),
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
	disconnect: protectedProcedure
		.route({
			method: "POST",
			path: "/integrations/disconnect",
			tags: ["Integrations"],
		})
		.input(
			z.object({
				connectionId: z
					.string()
					.describe("The ID of the connection to disconnect"),
			}),
		)
		.output(
			z.object({
				success: z
					.boolean()
					.describe("Whether the connection was disconnected successfully"),
			}),
		)
		.handler(async ({ input, context }) => {
			const { user } = context;

			const db = createDB();

			return await Sentry.startSpan(
				{
					name: "Disconnect Integration",
					op: "integration.disconnect",
				},
				async () => {
					return await db.transaction(async (tx) => {
						const dbStartTime = performance.now();
						const connections = await tx
							.delete(integrationSchema.nangoConnections)
							.where(
								and(
									eq(integrationSchema.nangoConnections.userId, user.id),
									eq(integrationSchema.nangoConnections.id, input.connectionId),
								),
							)
							.returning();
						const dbDuration = performance.now() - dbStartTime;
						const span = Sentry.getActiveSpan();
						if (span) {
							span.setAttribute("db.delete.processing_time_ms", dbDuration);
						}

						if (connections.length === 0) {
							throw new ORPCError("NOT_FOUND", {
								message: "No connection found",
							});
						}

						const [connection] = connections;

						try {
							const nangoClient = createNangoClient();
							const nangoStartTime = performance.now();
							await nangoClient.deleteConnection(
								connection.providerConfigKey,
								connection.id,
							);
							const nangoDuration = performance.now() - nangoStartTime;

							if (span) {
								span.setAttribute(
									"nango.delete.processing_time_ms",
									nangoDuration,
								);
							}

							return {
								success: true,
							};
						} catch (error) {
							throw new ORPCError("INTERNAL_SERVER_ERROR", {
								message: "Failed to delete connection.",
								cause: error,
							});
						}
					});
				},
			);
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

				const accounts = await getQuickbookAccounts(
					connection.id,
					connection.providerConfigKey,
				);

				return { accounts };
			}),
	},
};
