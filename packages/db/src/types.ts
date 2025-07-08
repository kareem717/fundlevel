import type { users } from "./schema/auth";
import type { nangoConnections } from "./schema/integration";

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type NangoConnection = typeof nangoConnections.$inferSelect;
export type InsertNangoConnection = typeof nangoConnections.$inferInsert;
