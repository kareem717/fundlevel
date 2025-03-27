import { logger, schemaTask } from "@trigger.dev/sdk/v3";
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
      message: "Successfully synced bank transactions",
    };
  },
});

export const syncAccountingAccountsTask = schemaTask({
  id: "sync-accounting-accounts",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing accounting accounts for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncAccountingAccounts(payload.companyId);

    return {
      message: "Successfully synced accounting accounts",
    };
  },
});

export const syncAccountingTransactionsTask = schemaTask({
  id: "sync-accounting-transactions",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(
      `Syncing accounting transactions for company ${payload.companyId}`,
      {
        payload,
        ctx,
      },
    );

    const service = getService();
    await service.company.syncAccountingTransactions(payload.companyId);

    return {
      message: "Successfully synced accounting transactions",
    };
  },
});

export const syncInvoicesTask = schemaTask({
  id: "sync-invoices",
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

export const syncJournalEntriesTask = schemaTask({
  id: "sync-journal-entries",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing journal entries for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncJournalEntries(payload.companyId);

    return {
      message: "Successfully synced journal entries",
    };
  },
});

export const syncVendorCreditsTask = schemaTask({
  id: "sync-vendor-credits",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing vendor credits for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncVendorCredits(payload.companyId);

    return {
      message: "Successfully synced vendor credits",
    };
  },
});

export const syncCreditNotesTask = schemaTask({
  id: "sync-credit-notes",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing credit notes for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncCreditNotes(payload.companyId);

    return {
      message: "Successfully synced credit notes",
    };
  },
});

export const syncPaymentsTask = schemaTask({
  id: "sync-payments",
  schema: z.object({
    companyId: z.number(),
  }),
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log(`Syncing payments for company ${payload.companyId}`, {
      payload,
      ctx,
    });

    const service = getService();
    await service.company.syncPayments(payload.companyId);

    return {
      message: "Successfully synced payments",
    };
  },
});
