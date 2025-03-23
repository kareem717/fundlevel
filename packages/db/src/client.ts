import { drizzle } from 'drizzle-orm/neon-serverless';
import { NeonHttpQueryResultHKT } from "drizzle-orm/neon-http"
import * as schema from "@fundlevel/db/schema"
import { PgTransaction } from "drizzle-orm/pg-core"
import { ExtractTablesWithRelations } from "drizzle-orm"

export const db = (url: string) => {
  const db = drizzle({
    connection: url,
    schema,
  });

  return db;
}

export type DB = ReturnType<typeof db>
export type Transaction = PgTransaction<NeonHttpQueryResultHKT, typeof import("./schema"), ExtractTablesWithRelations<typeof import("./schema")>>