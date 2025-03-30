import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { getService } from "./utils";

export const syncCompanyBankingDataTask = schemaTask({
  id: "sync-company-banking-data",
  schema: z.object({
    companyId: z.number(),
  }),
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log(`Syncing company banking data for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    
    try {
      logger.log(`Syncing bank accounts for company ${payload.companyId}`);
      await service.company.syncBankAccounts(payload.companyId);
    } catch (error) {
      logger.error(`Error syncing bank accounts for company ${payload.companyId}`, {
        error,
      });
    }

    try { 
      logger.log(`Syncing bank account transactions for company ${payload.companyId}`);
      await service.company.syncBankAccountTransactions(payload.companyId);
    } catch (error) {
      logger.error(`Error syncing bank account transactions for company ${payload.companyId}`, {
        error,
      });
    }

    return {
      message: "Successfully synced company banking data",
    };
  },
});

export const syncCompanyInvoicesTask = schemaTask({
  id: "sync-company-invoices",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing invoices for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncInvoices(payload.companyId);

    return {
      message: "Successfully synced invoices",
    };
  },
});
