import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const bankStatements = pgTable("bank_statements", {
	id: serial("id").primaryKey(),
	originalFileName: text("original_file_name").notNull(),
	r2Url: text("r2_url").notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSize: text("file_size").notNull(),
	userId: text("user_id").notNull(),
	processingStatus: varchar("processing_status", { length: 20 })
		.notNull()
		.default("pending"), // pending, processing, completed, failed
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
