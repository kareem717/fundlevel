import { pgEnum } from "drizzle-orm/pg-core";

export const dataProvider = pgEnum("data_provider", ["quickbooks", "plaid"]);
