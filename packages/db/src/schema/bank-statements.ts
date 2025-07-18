import { bigint, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bankStatements = pgTable("bank_statements", {
	id: serial("id").primaryKey(),
	originalFileName: text("original_file_name").notNull(),
	s3Key: text("s3_key").notNull(),
	fileType: text("file_type").notNull(),
	fileSizeBytes: bigint("file_size_bytes", { mode: "bigint" }).notNull(),
	extractionJobId: text("extraction_job_id"),
	extractionJobToken: text("extraction_job_token"),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
