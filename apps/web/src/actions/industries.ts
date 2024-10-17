"use server";

import { actionClient } from "@/lib/safe-action";
import { getAllIndustries as getIndustriesApi } from "@/lib/api";

/**
 * Create a venture
 */
export const getAllIndustries = actionClient.action(
	async ({ ctx: { apiClient } }) => {
		const resp = await getIndustriesApi({
			client: apiClient,
			throwOnError: true,
		});

    return resp.data
	}
);
