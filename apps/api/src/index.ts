import env from "@fundlevel/api/env";
import { OpenAPIHono } from "@hono/zod-openapi";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ORPCError } from "@orpc/server";
import { BodyLimitPlugin } from "@orpc/server/fetch";
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import * as Sentry from "@sentry/bun";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { WORKOS_COOKIE_KEY } from "./lib/workos";
import { createContext } from "./orpc/context";
import { appRouter } from "./orpc/routers/_app";

const app = new OpenAPIHono();

app.use(logger());

const handler = new OpenAPIHandler(appRouter, {
	plugins: [
		new ZodSmartCoercionPlugin(),
		new ResponseHeadersPlugin(),
		new CORSPlugin({
			origin: [env.WEB_APP_URL, env.BASE_URL],
			allowMethods: ["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
			allowHeaders: ["Content-Type", "Authorization", "Cookie", "*"],
			credentials: true,
		}),
		new BodyLimitPlugin({
			maxBodySize: 1024 * 1024, // 1MB
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });
	const { matched, response } = await handler.handle(c.req.raw, {
		context: context,
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

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

const getOpenAPISchema = async (c: Context) => {
	const openAPIGenerator = new OpenAPIGenerator({
		schemaConverters: [new ZodToJsonSchemaConverter()],
	});

	return await openAPIGenerator.generate(appRouter, {
		info: {
			title: "Fundlevel API",
			version: "1.0.0",
		},
		servers: [{ url: env.BASE_URL }],
		security: [{ CookieAuth: [] }],
		components: {
			securitySchemes: {
				CookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: WORKOS_COOKIE_KEY,
				},
			},
		},
	});
};

// Error handling
app.onError((err, c) => {
	if (env.NODE_ENV !== "production") {
		console.error(err);
	}

	Sentry.captureException(err); // Disabled on non-production environments

	if (err instanceof ORPCError) {
		return c.json(
			{ message: err.message, status: err.status },
			err.status as ContentfulStatusCode,
		);
	}

	// Unknown error
	return c.json({ message: "Internal Server Error", status: 500 }, 500);
});

Sentry.init({
	dsn: env.SENTRY_DSN,
	enabled: env.NODE_ENV === "production",
	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
	environment: env.NODE_ENV,
	// Enable logs to be sent to Sentry
	_experiments: { enableLogs: true },
	// Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
	// Learn more at
	// https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
	tracesSampleRate: 1.0,
});

export default {
	port: env.PORT,
	fetch: app.fetch,
};
