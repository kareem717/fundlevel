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
} from "@/lib/api";

/**
 * Create a new account for the currently authenticated user
 */
export const createAccount = actionClientWithUser
	.schema(createAccountSchema)
	.action(
		async ({
			parsedInput: { firstName, lastName },
			ctx: { apiClient, user },
		}) => {
			if (!user) {
				throw new Error("User not found");
			}

			return await createAccountApi({
				client: apiClient,
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
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("Account not found");
			}

			await updateAccountApi({
				client: apiClient,
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
		return account;
	}
);

/**
 * Get the currently authenticated user
 */
export const getUser = actionClientWithUser.action(
	async ({ ctx: { user } }) => {
		return user;
	}
);
