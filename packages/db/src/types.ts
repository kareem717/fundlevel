import type { bankStatements } from "./schema/bank-statements";
import type { nangoConnections } from "./schema/integration";
import type { transactions } from "./schema/transactions";

export type NangoConnection = typeof nangoConnections.$inferSelect;
export type InsertNangoConnection = typeof nangoConnections.$inferInsert;

export type BankStatement = typeof bankStatements.$inferSelect;
export type InsertBankStatement = typeof bankStatements.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
