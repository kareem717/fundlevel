"use server";

import { actionClient } from "@/lib/safe-action";
import { createOffer as createOfferApi } from "@/lib/api";
import { paginationRequestSchema } from "@/lib/validations/shared";
import { createOfferSchema } from "@/lib/validations/offers";

/**
 * Get all ventures
 */
export const createOffer = actionClient
	.schema(createOfferSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		return await createOfferApi({
			client: apiClient,
			throwOnError: true,
			body: {
				...parsedInput,
				investorAccountId: account.id,
			},
		});
	});
