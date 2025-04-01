import {
  pgTable,
  foreignKey,
  varchar,
  timestamp,
  integer,
  text,
  check,
  doublePrecision,
  jsonb,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { companies } from ".";

export const plaidAccountSubtype = pgEnum("plaid_account_subtype", [
  "401a", "401k", "403B", "457b", "529", "auto", "brokerage", "business",
  "cash isa", "cash management", "cd", "checking", "commercial", "construction",
  "consumer", "credit card", "crypto exchange", "ebt", "education savings account",
  "fixed annuity", "gic", "health reimbursement arrangement", "home equity",
  "hsa", "isa", "ira", "keogh", "lif", "life insurance", "line of credit",
  "lira", "loan", "lrif", "lrsp", "money market", "mortgage", "mutual fund",
  "non-custodial wallet", "non-taxable brokerage account", "other",
  "other insurance", "other annuity", "overdraft", "paypal", "payroll",
  "pension", "prepaid", "prif", "profit sharing plan", "rdsp", "resp",
  "retirement", "rlif", "roth", "roth 401k", "rrif", "rrsp", "sarsep",
  "savings", "sep ira", "simple ira", "sipp", "stock plan", "student",
  "thrift savings plan", "tfsa", "trust", "ugma", "utma", "variable annuity",
]);

export const plaidAccountType = pgEnum("plaid_account_type", [
  "investment",
  "credit",
  "depository",
  "loan",
  "brokerage",
  "other",
]);

export const bankAccounts = pgTable(
  "bank_accounts",
  {
    id: serial("id").primaryKey().notNull(),
    remoteId: text("remote_id").notNull().unique(),
    companyId: integer("company_id").notNull(),
    availableBalance: doublePrecision("available_balance"),
    currentBalance: doublePrecision("current_balance"),
    isoCurrencyCode: varchar("iso_currency_code", { length: 3 }),
    unofficialCurrencyCode: varchar("unofficial_currency_code", { length: 3 }),
    mask: varchar({ length: 4 }),
    name: text().notNull(),
    officialName: text("official_name"),
    type: plaidAccountType().notNull(),
    subtype: plaidAccountSubtype(),
    remainingRemoteContent: jsonb("remaining_remote_content").notNull(),
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
      name: "plaid_bank_accounts_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    check(
      "plaid_bank_accounts_check",
      sql`((iso_currency_code IS NOT NULL) AND (unofficial_currency_code IS NULL)) OR ((iso_currency_code IS NULL) AND (unofficial_currency_code IS NOT NULL))`,
    ),
  ],
); 