import {
  pgTable,
  foreignKey,
  varchar,
  timestamp,
  integer,
  text,
  boolean,
  pgEnum,
  doublePrecision,
  date,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import { companies } from ".";
import { bankAccounts } from "./bank-accounts";

export const plaidConfidenceLevel = pgEnum("plaid_confidence_level", [
  "VERY_HIGH",
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNKNOWN",
]);

export const plaidTransactionCode = pgEnum("plaid_transaction_code", [
  "adjustment",
  "atm",
  "bank charge",
  "bill payment",
  "cash",
  "cashback",
  "cheque",
  "direct debit",
  "interest",
  "purchase",
  "standing order",
  "transfer",
  "null",
]);

export const plaidTransactionPaymentChannel = pgEnum(
  "plaid_transaction_payment_channel",
  ["online", "in store", "other"],
);

export const bankTransactionRelationshipEntityType = pgEnum(
  "bank_account_transaction_relationship_entity_type",
  ["invoice"],
);

export const bankTransactions = pgTable(
  "bank_account_transactions",
  {
    remoteId: text("remote_id").primaryKey().notNull(),
    companyId: integer("company_id").notNull(),
    bankAccountId: text("bank_account_id").references(() => bankAccounts.remoteId).notNull(),
    isoCurrencyCode: varchar("iso_currency_code", { length: 3 }),
    unofficialCurrencyCode: varchar("unofficial_currency_code", { length: 3 }),
    checkNumber: text("check_number"),
    date: date().notNull(),
    datetime: timestamp({ withTimezone: true, mode: "string" }),
    name: text().notNull(),
    merchantName: text("merchant_name"),
    originalDescription: text("original_description"),
    pending: boolean().notNull(),
    website: text(),
    authorizedAt: timestamp("authorized_at", {
      withTimezone: true,
      mode: "string",
    }),
    paymentChannel: plaidTransactionPaymentChannel("payment_channel").notNull(),
    amount: doublePrecision().notNull(),
    personalFinanceCategoryPrimary: text("personal_finance_category_primary"),
    personalFinanceCategoryDetailed: text("personal_finance_category_detailed"),
    personalFinanceCategoryConfidenceLevel: plaidConfidenceLevel(
      "personal_finance_category_confidence_level",
    ),
    code: plaidTransactionCode(),
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
      name: "bank_account_transactions_company_id_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const bankTransactionRelationships = pgTable(
  "bank_account_transaction_relationships",
  {
    bankTransactionId: text("bank_account_transaction_id")
      .references(() => bankTransactions.remoteId)
      .notNull(),
    entityId: text("entity_id").notNull(),
    entityType: bankTransactionRelationshipEntityType("entity_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [
    primaryKey({
      columns: [table.bankTransactionId, table.entityId, table.entityType],
    }),
  ],
);

