"use server";

import {
	actionClientWithUser,
	actionClientWithAccount,
} from "@/lib/safe-action";
import {
	createAccount as createAccountApi,
	updateAccount as updateAccountApi,
} from "@repo/sdk";
import { zCreateAccountParams, zUpdateAccountParams } from "@repo/sdk/zod";
import { cache } from "react";

/**
 * Create a new account for the currently authenticated user
 */
export const createAccount = actionClientWithUser
	.schema(zCreateAccountParams)
	.action(
		async ({
			parsedInput,
			ctx: { axiosClient },
		}) => {

			return await createAccountApi({
				client: axiosClient,
				body: parsedInput,
				throwOnError: true,
			});
		}
	);

/**
 * Update the currently authenticated account
 */
export const updateAccount = actionClientWithAccount
	.schema(zUpdateAccountParams)
	.action(
		async ({
			parsedInput,
			ctx: { axiosClient, account },
		}) => {
			if (!account) {
				throw new Error("Account not found");
			}

			await updateAccountApi({
				client: axiosClient,
				body: parsedInput,
				throwOnError: true,
			});
		}
	);

/**
 * Get the currently authenticated account
 */
export const getAccount = actionClientWithAccount.action(
	async ({ ctx: { account } }) => {
		console.log("getAccoutn");
		return account;
	}
);

export const getAccountCached = cache(getAccount);

/**
 * Get the currently authenticated user
 */
export const getUser = actionClientWithUser.action(
	async ({ ctx: { user } }) => {
		console.log("gettingUser");
		return user;
	}
);

export const getUserCached = cache(getUser);
