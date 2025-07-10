import { env } from "cloudflare:workers";
import * as Sentry from "@sentry/cloudflare";
import type { User } from "@workos-inc/node";
import type { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
	createWorkOS,
	setSessionCookie,
	WORKOS_COOKIE_KEY,
} from "@/lib/workos";

const AUTH_DATA_KEY = "auth-data" as const;

export const getAuth = (c: Context) => {
	const authData = c.get(AUTH_DATA_KEY);

	if (!authData) {
		return null;
	}

	return authData as {
		user: User;
		sessionId: string;
	};
};

export const withAuth = () =>
	createMiddleware(async (c, next) => {
		const workos = createWorkOS();

		const sessionData = getCookie(c, WORKOS_COOKIE_KEY) || "";

		if (sessionData) {
			console.log("withAuth: session cookie data:", sessionData);
		}

		const session = workos.userManagement.loadSealedSession({
			sessionData,
			cookiePassword: env.WORKOS_COOKIE_PASSWORD,
		});

		const authResp = await session.authenticate();

		if (authResp.authenticated) {
			setSessionData(c, {
				sessionId: authResp.sessionId,
				user: authResp.user,
			});
			return next();
		}

		if (
			!authResp.authenticated &&
			authResp.reason === "no_session_cookie_provided"
		) {
			return next();
		}

		try {
			console.log("Refreshing session");
			const refreshResp = await session.refresh({
				cookiePassword: env.WORKOS_COOKIE_PASSWORD,
			});
			if (!refreshResp.authenticated || !refreshResp.sealedSession) {
				return next();
			}

			setSessionCookie(c, refreshResp.sealedSession);

			setSessionData(c, {
				sessionId: refreshResp.sessionId,
				user: refreshResp.user,
			});
			return next();
		} catch (error) {
			Sentry.captureException(error);
			deleteCookie(c, WORKOS_COOKIE_KEY);
			return next();
		}
	});

const setSessionData = (
	c: Context,
	authResp: {
		sessionId: string;
		user: User;
	},
) => {
	Sentry.setTags({
		userId: authResp.user.id, // downstream heavily depends on this tag
		sessionId: authResp.sessionId,
	});

	c.set(AUTH_DATA_KEY, {
		sessionId: authResp.sessionId,
		user: authResp.user,
	});
};
