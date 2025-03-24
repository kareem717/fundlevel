import { sentry } from '@hono/sentry'
import { env } from "hono/adapter";
import { MiddlewareHandler } from "hono";

export const withSentry = (): MiddlewareHandler => async (c, next) => {
  if (env(c).NODE_ENV === 'production') {
    return sentry({
      dsn: env(c).SENTRY_DSN,
    })(c, next)
  }

  await next()
}