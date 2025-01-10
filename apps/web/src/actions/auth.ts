import {
	actionClient,
	actionClientWithAccount,
	actionClientWithUser,
} from "@/lib/safe-action";
import { createClient } from "@/lib/utils/supabase/server";
import { createAccount, updateAccount } from "@repo/sdk";
import { zCreateAccountParams, zUpdateAccountParams } from "@repo/sdk/zod";
import { cache } from "react";

export const createAccountAction = actionClientWithUser
	.schema(zCreateAccountParams)
	.action(async ({ ctx: { axiosClient }, parsedInput }) => {
		const { data } = await createAccount({
			client: axiosClient,
			body: {
				...parsedInput,
			},
		});

		return data;
	});

export const getAccountAction = cache(
	actionClientWithAccount.action(async ({ ctx: { account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		return account;
	})
);

export const getSessionAction = cache(
	actionClient.action(async () => {
		const sb = await createClient();
		const {
			data: { session },
		} = await sb.auth.getSession();

		return session;
	})
);

export const getUserAction = cache(
	actionClient.action(async () => {
		const sb = await createClient();
		const {
			data: { user },
		} = await sb.auth.getUser();
		return user;
	})
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
