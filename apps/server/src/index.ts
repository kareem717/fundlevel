import { env } from "cloudflare:workers";
import { AUTH_SESSION_COOKIE_KEY } from "@fundlevel/auth/server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { createAuthClient } from "@server/lib/utils/auth";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthHandler, nangoHandler } from "./handlers";

const app = new OpenAPIHono();

// Middleware
app.use(logger()).use(
	cors({
		origin: [env.WEB_APP_URL, env.BASE_URL],
		allowMethods: ["GET", "POST", "OPTIONS", "*"],
		allowHeaders: ["Content-Type", "Authorization", "*"],
		credentials: true,
	}),
);

export const appRoutes = app
	.on(["POST", "GET"], "/auth/*", (c) => createAuthClient().handler(c.req.raw))
	.route("/health", healthHandler())
	.route("/nango", nangoHandler());

// Docs
app
	.get("/openapi.json", async (c) => {
		return c.json(getOpenAPISchema(c));
	})
	.get("/llms.txt", async (c) => {
		// Generate Markdown from your OpenAPI document
		const markdown = await createMarkdownFromOpenApi(
			JSON.stringify(getOpenAPISchema(c)),
		);

		return c.text(markdown);
	})
	.get(
		"/",
		Scalar({
			url: "/openapi.json",
			pageTitle: "Fundlevel API",
		}),
	);

// OpenAPI
app.openAPIRegistry.registerComponent("securitySchemes", "Cookie", {
	type: "apiKey",
	in: "cookie",
	name: AUTH_SESSION_COOKIE_KEY,
});

const getOpenAPISchema = (c: Context) =>
	app.getOpenAPI31Document({
		openapi: "3.1.0",
		info: {
			title: "Fundlevel API",
			version: "1.0.0",
		},
		servers: [
			{
				url: new URL(c.req.url).origin,
				description: "Current environment",
			},
		],
		security: [{ Cookie: [] }],
	});

export default app;
export type AppRouter = typeof appRoutes;
