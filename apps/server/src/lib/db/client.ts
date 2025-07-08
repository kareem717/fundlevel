import { env } from "cloudflare:workers";
import { getDb } from "@fundlevel/db";

export const createDB = () => getDb(env.DATABASE_URL);
