import {
	bigint,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const bankStatements = pgTable("bank_statements", {
	id: serial("id").primaryKey(),
	originalFileName: text("original_file_name").notNull(),
	s3Key: text("s3_key").notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSizeBytes: bigint("file_size_bytes", { mode: "bigint" }).notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
