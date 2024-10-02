"use server";

import { actionClient } from "@/lib/safe-action";
import { createRoundInvestment as createRoundInvestmentApi } from "@/lib/api";
import { createRoundInvestmentSchema } from "@/lib/validations/investments";

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
