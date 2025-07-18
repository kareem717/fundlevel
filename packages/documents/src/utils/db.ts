import { getDb as createDb, type DB } from "@fundlevel/db";
import env from "@fundlevel/documents/env";

let db: DB;

export const getDB = () => {
	if (!db) {
		db = createDb(env.DATABASE_URL);
	}
	return db;
};
