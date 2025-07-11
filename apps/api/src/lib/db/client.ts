import env from "@fundlevel/api/env";
import { getDb } from "@fundlevel/db";

export const createDB = () => getDb(env.DATABASE_URL);
