import type { nangoConnections } from "./schema/integration";

export type NangoConnection = typeof nangoConnections.$inferSelect;
export type InsertNangoConnection = typeof nangoConnections.$inferInsert;
