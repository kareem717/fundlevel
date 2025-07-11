import {
	date,
	decimal,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const receipts = pgTable("receipts", {
	id: serial("id").primaryKey(),
	originalFileName: text("original_file_name").notNull(),
	r2Url: text("r2_url").notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSize: text("file_size").notNull(),
	userId: text("user_id").notNull(),
	processingStatus: varchar("processing_status", { length: 20 })
		.notNull()
		.default("pending"), // pending, processing, completed, failed

	// Receipt-specific metadata extracted during OCR
	merchantName: text("merchant_name"),
	receiptDate: date("receipt_date"),
	totalAmountCents: integer("total_amount_cents"),
	taxAmountCents: integer("tax_amount_cents"),
	currency: varchar("currency", { length: 3 }).default("USD"),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const receiptItems = pgTable("receipt_items", {
	id: serial("id").primaryKey(),
	receiptId: integer("receipt_id")
		.references(() => receipts.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	userId: text("user_id").notNull(),

	// Item details extracted from receipt
	name: text("name").notNull(),
	quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
	unitPriceCents: integer("unit_price_cents").notNull(),
	totalPriceCents: integer("total_price_cents").notNull(),
	category: text("category"), // Food, Office Supplies, etc.

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
