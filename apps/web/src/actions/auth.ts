"use server";

import {
  actionClient,
  actionClientWithAccount,
  actionClientWithUser,
} from "@/lib/safe-action";
import {
  ACCOUNT_HEADER_KEY,
  USER_HEADER_KEY,
} from "@/lib/utils/supabase/middleware";
import { createClient } from "@/lib/utils/supabase/server";
import {
  createAccount,
  updateAccount,
  getStripeIdentityVerificationSessionUrl,
  getStripeIdentity,
  Account,
} from "@workspace/sdk";
import { zCreateAccountParams, zUpdateAccountParams } from "@workspace/sdk/zod";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { cache } from "react";
import { z } from "zod";

export const createAccountAction = actionClientWithUser
  .schema(zCreateAccountParams)
  .action(async ({ ctx: { axiosClient }, parsedInput }) => {
    await createAccount({
      client: axiosClient,
      body: {
        ...parsedInput,
      },
    });
  });

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

/**
 * Update the currently authenticated account
 */
export const updateAccountAction = actionClientWithAccount
  .schema(zUpdateAccountParams)
  .action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
    if (!account) {
      throw new Error("Account not found");
    }

    await updateAccount({
      client: axiosClient,
      body: parsedInput,
      throwOnError: true,
    });
  });

export const getStripeIdentitySessionAction = actionClientWithAccount
  .schema(z.string().url())
  .action(async ({ parsedInput, ctx: { axiosClient } }) => {
    const { data } = await getStripeIdentityVerificationSessionUrl({
      client: axiosClient,
      body: {
        return_url: parsedInput,
      },
      throwOnError: true,
    });

    return data;
  });

export const getStripeIdentityAction = cache(
  actionClientWithAccount.action(async ({ ctx: { axiosClient } }) => {
    const { data } = await getStripeIdentity({
      client: axiosClient,
    });

    return data;
  }),
);

export const getMiddlewareAuthAction = cache(async () => {
  const headersList = await headers();
  const user = headersList.get(USER_HEADER_KEY);
  const account = headersList.get(ACCOUNT_HEADER_KEY);

  let userData: User | null = null;
  let accountData: Account | null = null;

  if (user && user != "{}") {
    try {
      userData = JSON.parse(user);
    } catch (error) {
      console.error(error);
    }
  }

  if (account && account != "{}") {
    try {
      accountData = JSON.parse(account);
    } catch (error) {
      console.error(error);
    }
  }

  return { user: userData, account: accountData };
});
