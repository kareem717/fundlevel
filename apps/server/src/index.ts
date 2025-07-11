import { env } from "cloudflare:workers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import * as Sentry from "@sentry/cloudflare";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import {
	authHandler,
	bankStatementHandler,
	healthHandler,
	integrationHandler,
} from "./handlers";
import { WORKOS_COOKIE_KEY } from "./lib/workos";

const app = new OpenAPIHono();

// Middleware
app.use(logger()).use(
	cors({
		origin: [env.WEB_APP_URL, env.BASE_URL],
		allowMethods: ["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
		allowHeaders: ["Content-Type", "Authorization", "Cookie", "*"],
		credentials: true,
	}),
);

export const appRoutes = app
	.route("/health", healthHandler())
	.route("/integrations", integrationHandler())
	.route("/auth", authHandler())
	.route("/bank-statements", bankStatementHandler());

// Docs
app
	.get("/openapi.json", async (c) => {
		return c.json(await getOpenAPISchema(c));
	})
	.get("/llms.txt", async (c) => {
		// Generate Markdown from your OpenAPI document
		const markdown = await createMarkdownFromOpenApi(
			JSON.stringify(await getOpenAPISchema(c)),
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

app.openAPIRegistry.registerComponent("securitySchemes", "CookieAuth", {
	type: "apiKey",
	in: "cookie",
	name: WORKOS_COOKIE_KEY,
});

const getOpenAPISchema = async (c: Context) =>
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
		security: [{ CookieAuth: [] }],
	});

// Error handling
app.onError((err, c) => {
	if (env.NODE_ENV === "development") {
		console.error(err);
	} else {
		// Report _all_ unhandled errors.
		Sentry.captureException(err); // ik this is already handled by the withSentry wrapper
	}

	if (err instanceof HTTPException) {
		return c.json({ message: err.message, status: err.status }, err.status);
	}

	// Unknown error
	return c.json({ message: "Internal Server Error", status: 500 }, 500);
});

export default Sentry.withSentry(
	(env: CloudflareBindings) => {
		const { id: versionId } = env.CF_VERSION_METADATA;
		return {
			dsn: env.SENTRY_DSN,
			release: versionId,
			enabled: env.NODE_ENV === "production",
			// Adds request headers and IP for users, for more info visit:
			// https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#sendDefaultPii
			sendDefaultPii: true,

			// Enable logs to be sent to Sentry
			_experiments: { enableLogs: true },
			// Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
			// Learn more at
			// https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
			tracesSampleRate: 1.0,
		};
	},
	// your existing worker export
	app,
);

export type AppRouter = typeof appRoutes;
