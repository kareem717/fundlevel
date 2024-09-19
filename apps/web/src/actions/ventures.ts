"use server";

import { actionClient } from "@/lib/safe-action";
import {
	getAllVentures as getAllVenturesApi,
	createVenture as createVentureApi,
} from "@/lib/api";
import { paginationRequestSchema } from "@/lib/validations/shared";
import { createVentureSchema } from "@/lib/validations/ventures";

/**
 * Get all ventures
 */
export const getAllVentures = actionClient
	.schema(paginationRequestSchema)
	.action(
		async ({ parsedInput: { cursor, limit }, ctx: { apiClient, user } }) => {
			if (!user) {
				throw new Error("User not found");
			}

			return await getAllVenturesApi({
				client: apiClient,
				throwOnError: true,
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});
		}
	);

/**
 * Create a venture
 */
export const createVenture = actionClient
	.schema(createVentureSchema)
	.action(
		async ({
			parsedInput: { name, description },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("User not found");
			}

			return await createVentureApi({
				client: apiClient,
				throwOnError: true,
				body: {
					name,
					description,
					ownerAccountId: account.id,
				},
			});
		}
	);
