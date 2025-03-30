import { sentry } from "@hono/sentry";
import { env } from "hono/adapter";
import type { MiddlewareHandler } from "hono";

export const withSentry = (): MiddlewareHandler => async (c, next) =>
  sentry({
    dsn: env(c).SENTRY_DSN,
    environment: env(c).SENTRY_ENVIRONMENT,
  })(c, next);
