"use server";

import { actionClient } from "@/lib/safe-action";
import { createRoundInvestment as createRoundInvestmentApi } from "@/lib/api";
import { createInvestmentSchema } from "@/actions/validations/investments";

/**
 * Create a investment on a round
 */
export const createInvestment = actionClient
	.schema(createInvestmentSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
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
				...parsedInput,
				investorId: account.id,
			},
		});
	});
