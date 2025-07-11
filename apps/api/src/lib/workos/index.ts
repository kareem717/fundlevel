import env from "@fundlevel/api/env";
import { WorkOS } from "@workos-inc/node";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export const createWorkOS = () =>
	new WorkOS(env.WORKOS_API_KEY, {
		clientId: env.WORKOS_CLIENT_ID,
	});

export const WORKOS_COOKIE_KEY = "flvl-wos-session" as const;

export const setSessionCookie = (c: Context, session: string) => {
	const domain =
		env.NODE_ENV !== "development" ? `.${env.BASE_DOMAIN}` : undefined;

	setCookie(c, WORKOS_COOKIE_KEY, session, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "None", // Allows CORS-based cookie sharing across subdomains
		partitioned: true, // New browser standards will mandate this for foreign cookies
		domain,
	});
};
