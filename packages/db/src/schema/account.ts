import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";

export const accounts = pgTable(
  "accounts",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    email: varchar({ length: 360 }).notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull().$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);