"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createAccountSchema,
	updateAccountSchema,
} from "@/lib/validations/account";
import {
	createAccount as createAccountApi,
	updateAccount as updateAccountApi,
	getAccountByUserId as getAccountByUserIdApi,
} from "@/lib/api";

export const createAccount = actionClient
	.schema(createAccountSchema)
	.action(async ({ parsedInput: { name }, ctx: { apiClient, user } }) => {
		if (!user) {
			throw new Error("User not found");
		}

		return await createAccountApi({
			client: apiClient,
			body: {
				name,
				userId: user.id,
			},
			throwOnError: true,
		});
	});

export const updateAccount = actionClient
	.schema(updateAccountSchema)
	.action(async ({ parsedInput: { name }, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		return await updateAccountApi({
			client: apiClient,
			path: {
				id: account.id,
			},
			body: {
				name,
			},
			throwOnError: true,
		});
	});

export const getAccountByUserId = actionClient.action(
	async ({ ctx: { apiClient, account } }) => {
		return account;
	}
);
