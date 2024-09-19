"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createRound as createRoundApi,
} from "@/lib/api";
import { createRoundSchema } from "@/lib/validations/rounds";

/**
 * Get all ventures
 */
export const createRound = actionClient
	.schema(createRoundSchema)
	.action(
		  async ({ parsedInput, ctx: { apiClient, user } }) => {
			if (!user) {
				throw new Error("User not found");

			}

			return await createRoundApi({
				client: apiClient,
				throwOnError: true,
				body: {
					...parsedInput,
				},
			});
		}
	);
