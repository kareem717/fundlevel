"use server";

import { actionClient } from "@/lib/safe-action";
import { getAllVentures as getAllVenturesApi } from "@/lib/api";
import { paginationRequestSchema } from "@/lib/validations/shared";

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
