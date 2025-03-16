"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import { z } from "zod";

/**
 * Server action to reconcile bank transactions with invoices
 * Uses the AI service to identify matches and discrepancies
 */
export const reconcileTransactionsAction = actionClientWithAccount
  .schema(z.number())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api.ai["bank-account"][":id"].reconcile.$post({
      param: {
        id: parsedInput,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
      case 403:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An unexpected error occurred");
    }
  });
