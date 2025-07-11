import type { bankStatements } from "./schema/bank-statements";
import type { nangoConnections } from "./schema/integration";
import type { receiptItems, receipts } from "./schema/receipts";
import type { transactions } from "./schema/transactions";

export type NangoConnection = typeof nangoConnections.$inferSelect;
export type InsertNangoConnection = typeof nangoConnections.$inferInsert;

export type BankStatement = typeof bankStatements.$inferSelect;
export type InsertBankStatement = typeof bankStatements.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;

export type ReceiptItem = typeof receiptItems.$inferSelect;
export type InsertReceiptItem = typeof receiptItems.$inferInsert;
