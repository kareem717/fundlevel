import {
  pgTable,
  foreignKey,
  serial,
  uuid,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { accounts } from "./account";

export const companies = pgTable("companies", {
  id: serial().primaryKey().notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => accounts.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});

export const companySyncStatus = pgTable("company_sync_status", {
  companyId: integer("company_id")
    .primaryKey()
    .notNull()
    .references(() => companies.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  invoicesLastSyncedAt: timestamp("invoices_last_synced_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  transactionsLastSyncedAt: timestamp("transactions_last_synced_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  bankAccountsLastSyncedAt: timestamp("bank_accounts_last_synced_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  billsLastSyncedAt: timestamp("bills_last_synced_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

export const companyPlaidCredentials = pgTable(
  "company_plaid_credentials",
  {
    companyId: integer("company_id").primaryKey().notNull(),
    accessToken: text("access_token").notNull(),
    itemId: text("item_id").notNull(),
    transactionCursor: text("transaction_cursor"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "plaid_credentials_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const companyQuickBooksOauthCredentials = pgTable(
  "company_quick_books_oauth_credentials",
  {
    companyId: serial("company_id").primaryKey().notNull(),
    realmId: text("realm_id").notNull(),
    accessToken: text("access_token").notNull(),
    accessTokenExpiry: timestamp("access_token_expiry", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    refreshToken: text("refresh_token").notNull(),
    refreshTokenExpiry: timestamp("refresh_token_expiry", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "quick_books_oauth_credentials_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const quickBooksOauthStates = pgTable(
  "quick_books_oauth_states",
  {
    companyId: serial("company_id").primaryKey().notNull(),
    state: uuid().notNull(),
    redirectUrl: text("redirect_url").notNull(),
    authUrl: text("auth_url").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "quick_books_oauth_states_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);
