import { defineConfig } from "@hey-api/openapi-ts";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_BACKEND_OPENAPI_DOCS_URL!;

if (!url) {
	throw new Error("NEXT_PUBLIC_BACKEND_OPENAPI_DOCS_URL is not set");
}

export default defineConfig({
	client: "@hey-api/client-fetch",
	input: url,
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