import { env } from "cloudflare:workers";
import { createServerClient } from "@fundlevel/auth/server";

export const AUTH_BASE_PATH = "/auth" as const;

export const createAuthClient = () =>
	createServerClient({
		basePath: AUTH_BASE_PATH,
		databaseUrl: env.DATABASE_URL,
		trustedOrigins: [env.WEB_APP_URL],
		googleClientId: env.GOOGLE_CLIENT_ID,
		googleClientSecret: env.GOOGLE_CLIENT_SECRET,
		baseDomain: env.BASE_DOMAIN,
	});
