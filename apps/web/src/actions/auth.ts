"use server";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";

export const getTokenCached = cache(async () => {
  const { getToken } = await auth();
  const token = await getToken();

  return token;
});

export const getAccountCached = cache(async (token: string) => {
  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token).auth.$get();
  const status = resp.status;

  switch (status) {
    case 200:
      return await resp.json();
    case 401:
      throw new Error("Unauthorized");
    case 404:
      return null;
    default:
      console.error(resp);
      throw new Error("Failed to fetch account, status: " + status);
  }
});
