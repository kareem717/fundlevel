import { hc } from "hono/client";
import type { AppType } from "@fundlevel/api/client";

export const client = (baseUrl: string, bearerToken?: string) => {
  return hc<AppType>(baseUrl, {
    headers: bearerToken
      ? {
          Authorization: `Bearer ${bearerToken}`,
        }
      : undefined,
  });
};