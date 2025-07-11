import { sql } from "drizzle-orm";
import {
	date,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { bankStatements } from "./bank-statements";

export const transactions = pgTable("transactions", {
	id: serial("id").primaryKey(),
	amountCents: integer("amount_cents").notNull(),
	date: date("date").notNull(),
	description: text("description").notNull(),
	merchant: text("merchant").notNull(),
	currency: varchar("currency", { length: 3 }),
	userId: text("user_id").notNull(),
	bankStatementId: integer("bank_statement_id")
		.references(() => bankStatements.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
