import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import * as Sentry from "@sentry/bun";
import { deleteCookie, getCookie } from "hono/cookie";
import env from "../env";
import {
	createWorkOS,
	setSessionCookie,
	WORKOS_COOKIE_KEY,
} from "../lib/workos";
import type { ORPCContext } from "./context";

export const o = os.$context<ORPCContext>();

export const publicProcedure = o;

export const requireAuth = oo.spec(
	o.middleware(async ({ next, errors, context }) => {
		const sessionData = await Sentry.startSpan(
			{
				name: "ORPC Middleware Require Auth",
				op: "orpc.middleware.require_auth",
			},
			async (span) => {
				const startTime = performance.now();
				const workos = createWorkOS();

				const sessionData = getCookie(context.honoCtx, WORKOS_COOKIE_KEY) || "";

				if (sessionData) {
					span?.setAttribute(
						"middleware.require_auth.session_cookie_present",
						true,
					);
				} else {
					span?.setAttribute(
						"middleware.require_auth.session_cookie_present",
						false,
					);
				}

				const session = workos.userManagement.loadSealedSession({
					sessionData,
					cookiePassword: env.WORKOS_COOKIE_PASSWORD,
				});

				const authStartTime = performance.now();
				const authResp = await session.authenticate();
				span?.setAttribute(
					"orpc.middleware.require_auth.authenticate_time_ms",
					performance.now() - authStartTime,
				);
				span?.setAttribute(
					"orpc.middleware.require_auth.authenticated",
					authResp.authenticated,
				);

				if (authResp.authenticated) {
					span?.setAttribute(
						"orpc.middleware.require_auth.total_time_ms",
						performance.now() - startTime,
					);
					return {
						sessionId: authResp.sessionId,
						user: authResp.user,
					};
				}

				if (
					!authResp.authenticated &&
					authResp.reason === "no_session_cookie_provided"
				) {
					span?.setAttribute(
						"orpc.middleware.require_auth.reason",
						"no_session_cookie_provided",
					);
					span?.setAttribute(
						"orpc.middleware.require_auth.total_time_ms",
						performance.now() - startTime,
					);
					throw new ORPCError("UNAUTHORIZED", {
						message: "No session cookie provided",
					});
				}

				try {
					span?.setAttribute(
						"orpc.middleware.require_auth.refresh_attempted",
						true,
					);
					const refreshStartTime = performance.now();
					const refreshResp = await session.refresh({
						cookiePassword: env.WORKOS_COOKIE_PASSWORD,
					});
					span?.setAttribute(
						"orpc.middleware.require_auth.refresh_time_ms",
						performance.now() - refreshStartTime,
					);
					span?.setAttribute(
						"orpc.middleware.require_auth.refresh_success",
						refreshResp.authenticated,
					);

					if (!refreshResp.authenticated || !refreshResp.sealedSession) {
						span?.setAttribute(
							"orpc.middleware.require_auth.total_time_ms",
							performance.now() - startTime,
						);
						throw new ORPCError("UNAUTHORIZED", {
							message: "Failed to refresh session",
						});
					}

					span?.setAttribute(
						"orpc.middleware.require_auth.total_time_ms",
						performance.now() - startTime,
					);

					setSessionCookie(context.honoCtx, refreshResp.sealedSession);
					return {
						sessionId: refreshResp.sessionId,
						user: refreshResp.user,
					};
				} catch (error) {
					Sentry.captureException(error);
					deleteCookie(context.honoCtx, WORKOS_COOKIE_KEY);
					span?.setAttribute(
						"orpc.middleware.require_auth.refresh_error",
						true,
					);
					span?.setAttribute(
						"orpc.middleware.require_auth.total_time_ms",
						performance.now() - startTime,
					);

					if (error instanceof ORPCError) {
						throw error;
					}

					throw new ORPCError("UNAUTHORIZED", {
						message: "Failed to refresh session",
						cause: error,
					});
				}
			},
		);

		return next({
			context: {
				...context,
				...sessionData,
			},
		});
	}),
	{
		security: [{ Cookie: [] }],
	},
);
export const protectedProcedure = publicProcedure.use(requireAuth);
