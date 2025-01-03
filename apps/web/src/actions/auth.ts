"use server";

import {
	actionClientWithUser,
	actionClientWithAccount,
} from "@/lib/safe-action";
import {
	createAccountSchema,
	updateAccountSchema,
} from "@/actions/validations/account";
import {
	createAccount as createAccountApi,
	updateAccount as updateAccountApi,
} from "@repo/sdk";
import { cache } from "react";

/**
 * Create a new account for the currently authenticated user
 */
export const createAccount = actionClientWithUser
	.schema(createAccountSchema)
	.action(
		async ({
			parsedInput: { firstName, lastName },
			ctx: { axiosClient, user },
		}) => {
			if (!user) {
				throw new Error("User not found");
			}

			return await createAccountApi({
				client: axiosClient,
				body: {
					firstName,
					lastName,
					userId: user.id,
				},
				throwOnError: true,
			});
		}
	);

/**
 * Update the currently authenticated account
 */
export const updateAccount = actionClientWithAccount
	.schema(updateAccountSchema)
	.action(
		async ({
			parsedInput: { firstName, lastName },
			ctx: { axiosClient, account },
		}) => {
			if (!account) {
				throw new Error("Account not found");
			}

			await updateAccountApi({
				client: axiosClient,
				path: {
					id: account.id,
				},
				body: {
					firstName,
					lastName,
				},
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
