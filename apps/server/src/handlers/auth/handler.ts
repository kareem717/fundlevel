import { env } from "cloudflare:workers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { createWorkOS, WORKOS_COOKIE_KEY } from "@/lib/workos/client";
import { authRoutes } from "./routes";

export const authHandler = () =>
	new OpenAPIHono()
		.openapi(authRoutes.signIn, async (c) => {
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

				console.log(authenticateResponse);
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
				setCookie(c, WORKOS_COOKIE_KEY, sealedSession, {
					path: "/",
					httpOnly: true,
					secure: true,
					sameSite: "lax",
					domain: `.${env.BASE_DOMAIN}`, // TODO: idk if this is correct
				});

				// Redirect the user to the homepage
				return c.json(
					{
						redirectUrl: env.WEB_APP_URL,
						shouldRedirect: true,
					},
					200,
				);
			} catch (error) {
				throw new HTTPException(500, {
					message: "Failed to authenticate user",
					cause: error,
				});
			}
		});
