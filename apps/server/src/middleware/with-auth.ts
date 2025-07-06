import type { AuthType } from "@fundlevel/auth/types";
import * as Sentry from "@sentry/cloudflare";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createAuthClient } from "@/lib/utils/auth";

const AUTH_CLIENT_KEY = "auth-client" as const;
const SESSION_KEY = "auth-session" as const;
const USER_KEY = "auth-user" as const;

export const getAuth = (c: Context) => {
	const client = c.get(AUTH_CLIENT_KEY);
	const session = c.get(SESSION_KEY);
	const user = c.get(USER_KEY);

	if (!client || !session || !user) {
		return {
			client: null,
			session: null,
			user: null,
		};
	}

	return {
		client: client as ReturnType<typeof createAuthClient>,
		session: session as AuthType["Variables"]["session"],
		user: user as AuthType["Variables"]["user"],
	};
};

export const withAuth = () =>
	createMiddleware(async (c, next) => {
		const auth = createAuthClient();

		try {
			const resp = await auth.api.getSession({ headers: c.req.raw.headers });

			if (resp) {
				// set both or none
				Sentry.setTags({
					userId: resp.user.id, // downstream heavily depends on this tag
					sessionId: resp.session.id,
				});

				c.set(USER_KEY, resp.user);
				c.set(SESSION_KEY, resp.session);
				c.set(AUTH_CLIENT_KEY, auth);
				return await next();
			}
		} catch (e) {
			throw new HTTPException(500, {
				message: "Failed to get session",
				cause: e,
			});
		}

		return await next();
	});
