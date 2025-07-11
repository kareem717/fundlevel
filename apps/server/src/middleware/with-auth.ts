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
		return await Sentry.startSpan(
			{
				name: "Middleware Auth",
				op: "middleware.auth",
			},
			async (span) => {
				const startTime = performance.now();
				const workos = createWorkOS();
				const cookiePassword = env.WORKOS_COOKIE_PASSWORD;

				const sessionData = getCookie(c, WORKOS_COOKIE_KEY) || "";

				if (sessionData) {
					span?.setAttribute("middleware.auth.session_cookie_present", true);
				} else {
					span?.setAttribute("middleware.auth.session_cookie_present", false);
				}

				const session = workos.userManagement.loadSealedSession({
					sessionData,
					cookiePassword,
				});

				const authStartTime = performance.now();
				const authResp = await session.authenticate();
				span?.setAttribute(
					"middleware.auth.authenticate_time_ms",
					performance.now() - authStartTime,
				);
				span?.setAttribute(
					"middleware.auth.authenticated",
					authResp.authenticated,
				);

				if (authResp.authenticated) {
					setSessionData(c, {
						sessionId: authResp.sessionId,
						user: authResp.user,
					});
					span?.setAttribute(
						"middleware.auth.total_time_ms",
						performance.now() - startTime,
					);
					return next();
				}

				if (
					!authResp.authenticated &&
					authResp.reason === "no_session_cookie_provided"
				) {
					span?.setAttribute(
						"middleware.auth.reason",
						"no_session_cookie_provided",
					);
					span?.setAttribute(
						"middleware.auth.total_time_ms",
						performance.now() - startTime,
					);
					return next();
				}

				try {
					span?.setAttribute("middleware.auth.refresh_attempted", true);
					const refreshStartTime = performance.now();
					const refreshResp = await session.refresh({
						cookiePassword,
					});
					span?.setAttribute(
						"middleware.auth.refresh_time_ms",
						performance.now() - refreshStartTime,
					);
					span?.setAttribute(
						"middleware.auth.refresh_success",
						refreshResp.authenticated,
					);

					if (!refreshResp.authenticated || !refreshResp.sealedSession) {
						span?.setAttribute(
							"middleware.auth.total_time_ms",
							performance.now() - startTime,
						);
						return next();
					}

					setSessionCookie(c, refreshResp.sealedSession);

					setSessionData(c, {
						sessionId: refreshResp.sessionId,
						user: refreshResp.user,
					});
					span?.setAttribute(
						"middleware.auth.total_time_ms",
						performance.now() - startTime,
					);
					return next();
				} catch (error) {
					Sentry.captureException(error);
					deleteCookie(c, WORKOS_COOKIE_KEY);
					span?.setAttribute("middleware.auth.refresh_error", true);
					span?.setAttribute(
						"middleware.auth.total_time_ms",
						performance.now() - startTime,
					);
					return next();
				}
			},
		);
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
