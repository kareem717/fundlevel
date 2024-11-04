import { env } from "./src/env";
import { defineConfig } from "@hey-api/openapi-ts";
import * as dotenv from 'dotenv'

dotenv.config({
	path: ".env.local",
});

export default defineConfig({
	client: "@hey-api/client-fetch",
	input: process.env.NEXT_PUBLIC_BACKEND_OPENAPI_DOCS_URL!,
	// input: env.NEXT_PUBLIC_BACKEND_OPENAPI_DOCS_URL,
	output: {
		format: "prettier",
		lint: "eslint",
		path: "./src/lib/api",
	},
	types: {
		dates: "types+transform",
		enums: "javascript",
		name: "PascalCase",
	},
	schemas: {
		type: "form",
	},

});