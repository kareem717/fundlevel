"use server";

import { actionClient } from "@/lib/safe-action";
import { getAllIndustries as getIndustriesApi } from "@fundlevel/sdk";

/**
 * Create a venture
 */
export const getAllIndustries = actionClient.action(
  async ({ ctx: { axiosClient } }) => {
    const resp = await getIndustriesApi({
      client: axiosClient,
      throwOnError: true,
    });

    return resp.data;
  },
);
