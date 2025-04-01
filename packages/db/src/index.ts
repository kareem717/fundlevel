import { drizzle, type PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from "@fundlevel/db/schema";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";

export const db = (url: string) => {
  const db = drizzle({
    client: postgres(url, { prepare: false }),
    schema,
    logger: true
  });

  return db;
};

export type DB = ReturnType<typeof db>;
export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("./schema"),
  ExtractTablesWithRelations<typeof import("./schema")>
>;