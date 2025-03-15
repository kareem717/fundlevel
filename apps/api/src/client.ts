import { hc } from "hono/client";
import type { server } from "./core";

export type AppType = typeof server.routes;
export type Client = ReturnType<typeof hc<AppType>>;

export const createClient = (params: {
  bearer?: string;
  url: string;
}) => {
  const { bearer, url } = params;

  if (!url) {
    throw new Error("URL is required when using in Edge Runtime");
  }

  const client = hc<AppType>(url, {
    headers: bearer
      ? {
          Authorization: `Bearer ${bearer}`,
        }
      : {},
  });

  return client;
};
