import { defineConfig } from "drizzle-kit";

// @ts-ignore
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
	throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
	schema: "./src/schema",
	out: "./drizzle/migrations",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: dbUrl,
	},
});
