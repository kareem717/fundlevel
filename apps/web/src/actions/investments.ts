"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createRoundInvestment as createRoundInvestmentApi,
	getAccountRoundInvestmentsCursor as getAccountRoundInvestmentsCursorApi,
} from "@/lib/api";
import { createRoundInvestmentSchema } from "@/actions/validations/investments";
import { cursorPaginationSchema } from "@/actions/validations/shared";

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
