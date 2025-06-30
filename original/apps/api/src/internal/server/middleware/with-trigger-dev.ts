import type { MiddlewareHandler } from "hono";
import { configure } from "@trigger.dev/sdk/v3";
import { env } from "hono/adapter";

export const withTriggerDev = (): MiddlewareHandler => async (c, next) => {
  configure({
    secretKey: env(c).TRIGGER_SECRET_KEY,
  });

  await next();
};
