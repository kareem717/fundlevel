/* eslint-disable node/no-process-env */

import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

// Handle dotenv loading gracefully in CI/production environments
try {
	expand(
		config({
			path: path.resolve(
				process.cwd(),
				process.env.NODE_ENV === "test" ? ".env.test" : ".env.local",
			),
		}),
	);
} catch (error) {
	// Only log the error if it's not a missing file in production
	if (
		process.env.NODE_ENV === "production" &&
		error &&
		typeof error === "object" &&
		"code" in error &&
		error.code === "ENOENT"
	) {
		console.log(
			"No .env file found in production environment - using environment variables",
		);
	} else {
		console.error("Error loading .env file:", error);
	}
}

const EnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	DATABASE_URL: z.string().url(),
	MISTRAL_API_KEY: z.string(),
	SENTRY_DSN: z.string().url(),
	SENTRY_AUTH_TOKEN: z.string(),
	SKIP_ENV_VALIDATION: z.boolean().optional(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error && process.env.SKIP_ENV_VALIDATION !== "true") {
	console.error("❌ Invalid env:");
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: IDE is complaining about this
export default env!;
