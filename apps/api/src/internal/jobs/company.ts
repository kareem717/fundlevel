import { logger, schemaTask, wait } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { getService } from "./utils";

export const syncBankAccountsTask = schemaTask({
  id: "sync-bank-accounts",
  schema: z.object({
    companyId: z.number(),
  }),
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log(`Syncing bank accounts for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncBankAccounts(payload.companyId);


    return {
      message: "Successfully synced bank accounts",
    };
  },
});

export const syncBankTransactionsTask = schemaTask({
  id: "sync-bank-transactions",
  schema: z.object({
    companyId: z.number(),
  }),
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log(`Syncing bank transactions for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncBankTransactions(payload.companyId);


    return {
      message: "Successfully synced bank accounts",
    };
  },
});