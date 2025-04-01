import {
  pgTable,
  foreignKey,
  serial,
  varchar,
  timestamp,
  integer,
  text,
  doublePrecision,
  jsonb,
  date,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { companies } from ".";
import { dataProvider } from "./shared";

export const invoices = pgTable(
  "invoices",
  {
    id: serial().primaryKey().notNull(),
    companyId: integer("company_id").notNull(),
    remoteId: text("remote_id").notNull(),
    syncToken: text("sync_token").notNull(),
    currency: varchar("currency", { length: 3 }),
    totalAmount: doublePrecision("total_amount").notNull(),
    balanceRemaining: doublePrecision("balance_remaining"),
    dueDate: date("due_date"),
    remainingRemoteContent: jsonb("remaining_remote_content").notNull(),
    dataProvider: dataProvider("data_provider").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "invoices_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    unique("invoices_remote_id_key").on(table.remoteId),
  ],
);

export const invoiceLineTypes = pgEnum("invoice_line_type", [
  "sales_item",
  "group",
  "description_only",
  "discount",
  "sub_total",
]);

export const invoiceLines = pgTable(
  "invoice_lines",
  {
    id: serial("id").primaryKey().notNull(),
    // psql counts null vals as unique, so we need to default to a non-null value
    remoteId: text("remote_id").default("").notNull(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    amount: doublePrecision("amount").notNull(),
    detailType: invoiceLineTypes("detail_type").notNull(),
    details: jsonb("details").$type<any[]>().notNull(),
    description: text("description"),
    lineNumber: integer("line_number"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [
    unique("invoice_lines_remote_id_invoice_id_detail_type_key").on(
      table.remoteId,
      table.invoiceId,
      table.detailType,
    ),
  ],
);