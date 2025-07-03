import { env } from "cloudflare:workers";
import { createServerClient } from "@fundlevel/auth/server";

export const createAuthClient = () =>
	createServerClient({
		basePath: "/auth",
		databaseUrl: env.DATABASE_URL,
		trustedOrigins: [env.WEB_APP_URL],
		googleClientId: env.GOOGLE_CLIENT_ID,
		googleClientSecret: env.GOOGLE_CLIENT_SECRET,
		baseDomain: "localhost",
	});
