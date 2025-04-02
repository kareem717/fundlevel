import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text,
  doublePrecision,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { companies } from ".";
import { dataProvider } from "./shared";

export const bills = pgTable("bills", {
  id: serial().primaryKey().notNull(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id),
  remoteId: text("remote_id").notNull().unique(),
  syncToken: text("sync_token").notNull(),
  vendorName: text("vendor_name"),
  currency: varchar("currency", { length: 3 }),
  transactionDate: date("transaction_date"),
  totalAmount: doublePrecision("total_amount"),
  remainingRemoteContent: jsonb("remaining_remote_content").notNull(),
  dueDate: date("due_date"),
  remainingBalance: doublePrecision("remaining_balance"),
  dataProvider: dataProvider("data_provider").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).$onUpdateFn(() => new Date().toISOString()),
});

export const billLines = pgTable("bill_lines", {
  id: serial().primaryKey().notNull(),
  billId: integer("bill_id")
    .notNull()
    .references(() => bills.id),
  remoteId: text("remote_id").notNull().unique(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  remainingRemoteContent: jsonb("remaining_remote_content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).$onUpdateFn(() => new Date().toISOString()),
});
