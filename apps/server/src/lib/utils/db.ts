import { env } from "cloudflare:workers";
import { getDb } from "@fundlevel/db";

export const db = getDb(env.DATABASE_URL);
