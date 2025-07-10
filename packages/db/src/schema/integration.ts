import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const nangoConnections = pgTable("nango_connections", {
	id: text("id").primaryKey(),
	provider: text("provider").notNull(),
	userId: text("user_id").notNull(),
	providerConfigKey: text("provider_config_key").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
