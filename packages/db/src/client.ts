import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";

const client = postgres(process.env.POSTGRES_URL!);

export const db = drizzle(client, { schema });

export type Client = typeof db;

export * from "drizzle-orm"
