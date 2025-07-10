import { env } from "cloudflare:workers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import {
	createWorkOS,
	setSessionCookie,
	WORKOS_COOKIE_KEY,
} from "@/lib/workos";
import { getAuth } from "@/middleware/with-auth";
import { authRoutes } from "./routes";

export const authHandler = () =>
	new OpenAPIHono()
		.openapi(authRoutes.signIn, async (c) => {
			const session = getAuth(c);
			if (session) {
				throw new HTTPException(403, { message: "Already signed in." });
			}

			const workos = createWorkOS();

			const redirectUri = `${env.BASE_URL}/auth${authRoutes.callback.path}`;
			const authorizationUrl = workos.userManagement.getAuthorizationUrl({
				// Specify that we'd like AuthKit to handle the authentication flow
				provider: "authkit",

				// The callback endpoint that WorkOS will redirect to after a user authenticates
				redirectUri,

				clientId: env.WORKOS_CLIENT_ID,
			});

			c.header("Location", authorizationUrl);
			// Redirect the user to the AuthKit sign-in page
			return c.json(
				{
					redirectUrl: authorizationUrl,
					shouldRedirect: true,
				},
				200,
			);
		})
		.openapi(authRoutes.signOut, async (c) => {
			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const cookie = getCookie(c, WORKOS_COOKIE_KEY);
			if (!cookie) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			const workos = createWorkOS();
			const sealedSession = workos.userManagement.loadSealedSession({
				sessionData: cookie,
				cookiePassword: env.WORKOS_COOKIE_PASSWORD,
			});

			const redirectUrl = await sealedSession.getLogoutUrl({
				returnTo: c.req.valid("query").redirectUrl,
			});

			c.header("Location", redirectUrl);
			return c.json(
				{
					redirectUrl,
					shouldRedirect: true,
				},
				200,
			);
		})
		.openapi(authRoutes.callback, async (c) => {
			const workos = createWorkOS();
			const { code } = c.req.valid("query");

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
				throw new HTTPException(500, {
					message: "Failed to handle callback",
					cause: error,
				});
			}

			if (!sealedSession) {
				throw new HTTPException(500, {
					message: "Failed to generate session cookie",
				});
			}

			try {
				setSessionCookie(c, sealedSession);
				// Redirect the user to the homepage
				return c.redirect(env.WEB_APP_URL, 308);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to authenticate user",
					cause: error,
				});
			}
		})
		.openapi(authRoutes.session, async (c) => {
			const cookie = getCookie(c, WORKOS_COOKIE_KEY);

			const session = getAuth(c);
			if (!session) {
				throw new HTTPException(403, { message: "Unauthorized" });
			}

			return c.json({ session }, 200);
		});
