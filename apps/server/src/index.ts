import { env } from "cloudflare:workers";
import { OpenAPIGenerator } from "@orpc/openapi";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuthClient } from "@/lib/utils/auth";
import { createContext } from "@/lib/utils/context";
import { appRouter } from "@/routers/index";
import { webhookRouter } from "./routers/webhooks";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: [env.WEB_APP_URL, env.BASE_URL],
		allowMethods: ["GET", "POST", "OPTIONS", "*"],
		allowHeaders: ["Content-Type", "Authorization", "*"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/auth/*", (c) =>
	createAuthClient().handler(c.req.raw),
);

app.route("/webhooks", webhookRouter);

const rpcHandler = new RPCHandler(appRouter, {
	plugins: [new ZodSmartCoercionPlugin()],
});

app.use("/rpc/*", async (c, next) => {
	const context = await createContext({ context: c });
	const result = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (result.matched) {
		if (c.req.raw.url.includes("session-token")) {
			if (result.response.status === 400) {
				console.log("400", c.req.raw);
			} else if (result.response.status === 200) {
				console.log("200", c.req.raw);
			}
		}

		return result.response;
	}

	await next();
});

app.get("/openapi.json", async (c) => {
	return c.json(await getOpenAPISchema());
});

app.get("/llms.txt", async (c) => {
	// Generate Markdown from your OpenAPI document
	const schema = await getOpenAPISchema();
	const markdown = await createMarkdownFromOpenApi(schema);

	/**
	 * Register a route to serve the Markdown for LLMs
	 *
	 * Q: Why /llms.txt?
	 * A: It's a proposal to standardise on using an /llms.txt file.
	 *
	 * @see https://llmstxt.org/
	 */
	return c.text(markdown);
});

const getOpenAPISchema = async () => {
	const openAPIGenerator = new OpenAPIGenerator({
		schemaConverters: [new ZodToJsonSchemaConverter()],
	});

	const schema = await openAPIGenerator.generate(appRouter, {
		info: {
			title: "Fundlevel API",
			version: "1.0.0",
		},
		servers: [
			{
				url: env.BASE_URL + "/rpc",
			} /** Should use absolute URLs in production */,
		],
		// security: [{ cookieAuth: [] }],
		// components: {
		// 	securitySchemes: {
		// 		cookieAuth: {
		// 			type: 'http',
		// 			scheme: 'cookie',
		// 		},
		// 	},
		// },
	});

	return schema;
};

export default app;
