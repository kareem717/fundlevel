"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createRoundInvestment as createRoundInvestmentApi,
	getAccountRoundInvestmentsCursor as getAccountRoundInvestmentsCursorApi,
	getAccountRecievedRoundInvestmentsCursor as getAccountReceivedRoundInvestmentsCursorApi,
} from "@/lib/api";
import { createRoundInvestmentSchema } from "@/lib/validations/investments";
import { cursorPaginationSchema } from "@/lib/validations/shared";

/**
 * Get all ventures
 */
export const createRoundInvestment = actionClient
	.schema(createRoundInvestmentSchema)
	.action(
		async ({
			parsedInput: { amount, roundId },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("Account not found");
			}

			await createRoundInvestmentApi({
				client: apiClient,
				path: {
					id: account.id,
				},
				throwOnError: true,
				body: {
					amount,
					roundId,
					investorId: account.id,
					status: "pending",
				},
			});
		}
	);

export const getAccountRoundInvestmentsCursor = actionClient
	.schema(cursorPaginationSchema)
	.action(
		async ({ parsedInput: { cursor, limit }, ctx: { apiClient, account } }) => {
			if (!account) {
				throw new Error("Account not found");
			}

			const response = await getAccountRoundInvestmentsCursorApi({
				client: apiClient,
				path: {
					id: account.id,
				},
				query: {
					cursor,
					limit,
				},
			});

			return response.data;
		}
	);

export const getAccountReceivedRoundInvestmentsCursor = actionClient
	.schema(cursorPaginationSchema)
	.action(
		async ({ parsedInput: { cursor, limit }, ctx: { apiClient, account } }) => {
			if (!account) {
				throw new Error("Account not found");
			}

			const response = await getAccountReceivedRoundInvestmentsCursorApi({
				client: apiClient,
				path: {
					id: account.id,
				},
				query: {
					cursor,
					limit,
				},
			});

			return response.data;
		}
	);
