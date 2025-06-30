import { env } from "hono/adapter";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

export const withCors = (): MiddlewareHandler => async (c, next) => {
  return cors({
    origin: [env(c).WEB_URL, env(c).APP_URL],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "x-is-superjson"],
    credentials: true,
    exposeHeaders: ["*"],
  })(c, next);
};
