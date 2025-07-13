import env from "@fundlevel/api/env";
import {
	createWorkOS,
	setSessionCookie,
	WORKOS_COOKIE_KEY,
} from "@fundlevel/api/lib/workos";
import { ORPCError } from "@orpc/server";
import { getCookie } from "hono/cookie";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../init";
import { RedirectResponseSchema } from "../schemas";

export const authRouter = {
	signIn: publicProcedure
		.route({
			method: "GET",
			path: "/auth/sign-in",
			tags: ["Auth"],
		})
		.output(RedirectResponseSchema)
		.handler(async ({ context }) => {
			// Check if user is already authenticated
			if (context.user) {
				throw new ORPCError("FORBIDDEN", {
					message: "Already signed in.",
				});
			}

			const workos = createWorkOS();
			const redirectUri = `${env.BASE_URL}/auth/callback`;
			const authorizationUrl = workos.userManagement.getAuthorizationUrl({
				provider: "authkit",
				redirectUri,
				clientId: env.WORKOS_CLIENT_ID,
			});

			return {
				location: authorizationUrl,
				shouldRedirect: true,
			};
		}),

	signOut: protectedProcedure
		.route({
			method: "GET",
			path: "/auth/sign-out",
			tags: ["Auth"],
			inputStructure: "detailed",
		})
		.input(
			z.object({
				query: z.object({
					redirectUrl: z
						.string()
						.url()
						.optional()
						.describe("URL to redirect to after sign-out"),
				}),
			}),
		)
		.output(RedirectResponseSchema)
		.handler(async ({ input, context }) => {
			const cookie = getCookie(context.honoCtx, WORKOS_COOKIE_KEY);
			if (!cookie) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Unauthorized",
				});
			}

			const workos = createWorkOS();
			const sealedSession = workos.userManagement.loadSealedSession({
				sessionData: cookie,
				cookiePassword: env.WORKOS_COOKIE_PASSWORD,
			});

			try {
				const redirectUrl = await sealedSession.getLogoutUrl({
					returnTo: input.query.redirectUrl,
				});

				return {
					location: redirectUrl,
					shouldRedirect: true,
				};
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to get logout URL",
					cause: error,
				});
			}
		}),

	callback: publicProcedure
		.route({
			method: "GET",
			path: "/auth/callback",
			tags: ["Auth"],
			inputStructure: "detailed",
			outputStructure: "detailed",
			successStatus: 301,
		})
		.input(
			z.object({
				query: z.object({
					code: z.string().describe("Authorization code from WorkOS"),
				}),
			}),
		)
		.output(
			z.object({
				success: z
					.boolean()
					.describe("Whether the authentication was successful"),
			}),
		)
		.handler(async ({ input, context }) => {
			const workos = createWorkOS();
			const { code } = input.query;

			let sealedSession: string | null = null;
			try {
				const authenticateResponse =
					await workos.userManagement.authenticateWithCode({
						clientId: env.WORKOS_CLIENT_ID,
						code,
						session: {
							sealSession: true,
							cookiePassword: env.WORKOS_COOKIE_PASSWORD,
						},
					});

				sealedSession = authenticateResponse.sealedSession ?? null;
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to handle callback",
					cause: error,
				});
			}

			if (!sealedSession) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to generate session cookie",
				});
			}

			try {
				setSessionCookie(context.honoCtx, sealedSession);
				// Redirect the user to the homepage
				context.honoCtx.redirect(env.WEB_APP_URL, 308);
				return { success: true };
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to authenticate user",
					cause: error,
				});
			}
		}),

	session: protectedProcedure
		.route({
			method: "GET",
			path: "/auth/session",
			tags: ["Auth"],
		})
		.output(
			z.object({
				sessionId: z.string().describe("Session ID"),
				user: z
					.object({
						object: z.literal("user"),
						id: z.string(),
						email: z.string(),
						emailVerified: z.boolean(),
						profilePictureUrl: z.string().nullable(),
						firstName: z.string().nullable(),
						lastName: z.string().nullable(),
						lastSignInAt: z.string().nullable(),
						createdAt: z.string(),
						updatedAt: z.string(),
						externalId: z.string().nullable(),
						metadata: z.record(z.string()),
					})
					.describe("User information"),
			}),
		)
		.handler(async ({ context }) => ({
			sessionId: context.sessionId,
			user: context.user,
		})),
};
