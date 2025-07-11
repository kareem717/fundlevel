/* eslint-disable node/no-process-env */

import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(
	config({
		path: path.resolve(
			process.cwd(),
			process.env.NODE_ENV === "test" ? ".env.test" : ".env.local",
		),
	}),
);

const EnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
		.default("info"),
	DATABASE_URL: z.string().url(),
	NANGO_SECRET_KEY: z.string(),
	SENTRY_DSN: z.string(),
	MISTRAL_API_KEY: z.string(),
	WORKOS_API_KEY: z.string(),
	WORKOS_CLIENT_ID: z.string(),
	WORKOS_COOKIE_PASSWORD: z.string(),
	WEB_APP_URL: z.string().url(),
	BASE_URL: z.string().url(),
	BASE_DOMAIN: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
	console.error("❌ Invalid env:");
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: IDE is complaining about this
export default env!;
