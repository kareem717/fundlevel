"use server";

import {
  actionClient,
  actionClientWithAccount,
  actionClientWithUser,
} from "@/lib/safe-action";
import { createClient } from "@/lib/utils/supabase/server";
import { cache } from "react";

export const createAccountAction = actionClientWithUser.action(
  async ({ ctx: { api, user } }) => {
    if (!user.email) {
      throw new Error("Email not found");
    }

    const req = await api.accounts.$post({
      json: {
        email: user.email,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  },
);

export const getAccountAction = cache(
  actionClientWithAccount.action(async ({ ctx: { account } }) => {
    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }),
);

export const getSessionAction = cache(
  actionClient.action(async () => {
    const sb = await createClient();
    const {
      data: { session },
    } = await sb.auth.getSession();

    return session;
  }),
);

export const getUserAction = cache(
  actionClient.action(async () => {
    const client = await createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    return user;
  }),
);
