import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const nangoProviders = pgEnum("nango_providers", [
	"QuickBooks",
	"Google Sheets",
]);

export const nangoConnections = pgTable("nango_connections", {
	id: text("id").primaryKey(),
	provider: text("provider").notNull(),
	userId: text("user_id").notNull(),
	providerConfigKey: nangoProviders("provider_config_key").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
		.notNull()
		.$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
