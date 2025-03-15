import { SeedPostgres } from "@snaplet/seed/adapter-postgres";
import { defineConfig } from "@snaplet/seed/config";
import * as postgres from "postgres";

export default defineConfig({
  adapter: async () => {
    const client = postgres(process.env.DATABASE_URL);
    return new SeedPostgres(client);
  },
  select: [
    // We don't alter any extensions tables that might be owned by extensions
    "!*",
    // We want to alter all the tables under public schema
    "public.*",
    // We also want to alter some of the tables under the auth schema
    "auth.users",
  ],
});
