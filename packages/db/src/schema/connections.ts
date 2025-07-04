import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const nangoConnections = pgTable("nango_connections", {
	id: text("id").primaryKey(),
	provider: text("provider").notNull(),
	user_id: integer("user_id").references(() => users.id),
	created_at: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
