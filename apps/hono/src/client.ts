import { hc } from "hono/client";
import { server } from "./core";
import { env } from "./env";

export type AppType = typeof server.routes

export const createClient = (bearer: string) => hc<AppType>(
  env.APP_URL,
  {
    headers: {
      Authorization: `Bearer ${bearer}`
    }
  }
)