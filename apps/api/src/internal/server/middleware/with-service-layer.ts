import { Service } from "@fundlevel/api/internal/service";
import { db } from "@fundlevel/db";
import { Storage } from "../../storage";
import type { Context, MiddlewareHandler } from "hono";
import { env } from "hono/adapter";

/**
 * Extends Hono's Context to include user and account objects
 */
declare module "hono" {
  interface ContextVariableMap {
    service: Service;
  }
}

export const getService = (c: Context) => {
  return c.get("service");
};

export const withService = (): MiddlewareHandler => async (c, next) => {
  const storage = new Storage(db(env(c).DATABASE_URL));

  const service = new Service(
    storage,
    {
      clientId: env(c).QUICK_BOOKS_CLIENT_ID,
      clientSecret: env(c).QUICK_BOOKS_CLIENT_SECRET,
      redirectUri: env(c).QUICK_BOOKS_REDIRECT_URI,
      environment: env(c).QUICK_BOOKS_ENVIRONMENT,
    },
    {
      clientId: env(c).PLAID_CLIENT_ID,
      secret: env(c).PLAID_SECRET,
      webhookUrl: env(c).PLAID_WEBHOOK_URL,
      environment: env(c).PLAID_ENVIRONMENT,
    },
    env(c).CLERK_PUBLISHABLE_KEY,
  );

  c.set("service", service);

  await next();
};
