import { Account } from "@fundlevel/db/types";
import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { getService } from "./with-service-layer";
import { env } from "hono/adapter";

/**
 * Extends Hono's Context to include user and account objects
 */
declare module "hono" {
  interface ContextVariableMap {
    account: Account | null;
    userId: string | null;
  }
}

export const getAccount = (c: Context) => {
  return c.get("account");
};

export const getUserId = (c: Context) => {
  return c.get("userId");
};

export const withAuth = (): MiddlewareHandler => {
  return async (c, next) => {
    const authorization = c.req.header("Authorization");
    if (!authorization) {
      c.set("userId", null);
      c.set("account", null);
      return await next();
    }

    const parsedBearer = authorization?.split("Bearer ");
    if (authorization && parsedBearer?.length !== 2) {
      c.get("sentry").setContext("authorization", {
        hasAuthorization: !!authorization,
        parsedBearer:
          parsedBearer?.length && parsedBearer.length > 1
            ? "Bearer [REDACTED]"
            : "MALFORMED",
      });

      c.get("sentry").captureMessage("Invalid authorization header", "error");
      throw new HTTPException(400, {
        message: "Invalid authorization header",
      });
    }

    const clerkClient = createClerkClient({
      secretKey: env(c).CLERK_SECRET_KEY,
      publishableKey: env(c).CLERK_PUBLISHABLE_KEY,
    });

    let userId: string | null = null;
    try {
      let verifiedToken: Awaited<ReturnType<typeof verifyToken>> | null = null;

      try {
        verifiedToken = await verifyToken(parsedBearer[1]!, {
          jwtKey: env(c).CLERK_PUBLIC_JWT_KEY,
          secretKey: env(c).CLERK_SECRET_KEY,
          clockSkewInMs: 120000,
          authorizedParties: [env(c).WEB_URL, env(c).APP_URL],
        });
      } catch (error) {
        c.get("sentry").setContext("token", {
          hasToken: !!parsedBearer,
          token:
            parsedBearer?.length && parsedBearer.length > 1
              ? "Bearer [REDACTED]"
              : "MALFORMED",
        });
        c.get("sentry").captureException(error);

        throw new HTTPException(500, {
          message: "Failed to verify token.",
        });
      }

      if (!verifiedToken) {
        throw new HTTPException(401, {
          message: "Unauthorized",
        });
      }

      const session = await clerkClient.sessions.getSession(verifiedToken.sid);

      userId = session.userId;
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      c.get("sentry").setContext("token", {
        hasToken: !!parsedBearer,
        token:
          parsedBearer?.length && parsedBearer.length > 1
            ? "Bearer [REDACTED]"
            : "MALFORMED",
      });
      c.get("sentry").captureException(error);

      throw new HTTPException(500, {
        message: "Failed to verify token.",
      });
    }

    c.set("userId", userId);

    if (userId) {
      try {
        const service = getService(c);
        const account = await service.auth.getAccountByUserId(userId);
        c.set("account", account);
      } catch (error) {
        c.get("sentry").setContext("account", {
          userId: userId,
        });
        c.get("sentry").captureException(error);
        throw new HTTPException(500, {
          message: "Failed to get account.",
        });
      }
    } else {
      c.set("account", null);
    }

    await next();
  };
};
