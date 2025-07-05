import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const nangoConnections = pgTable("nango_connections", {
	id: text("id").primaryKey(),
	provider: text("provider").notNull(),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
	providerConfigKey: text("provider_config_key").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
