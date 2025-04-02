import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { getService } from "./utils";

export const reconcileInvoiceTask = schemaTask({
  id: "reconcile-invoice",
  schema: z.object({
    invoiceId: z.number(),
  }),
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log(`Reconciling invoice ${payload.invoiceId}`, {
      payload,
      ctx,
    });

    const service = getService();
    const result = await service.invoice.reconcile(payload.invoiceId);

    return {
      message: "Successfully reconciled invoice",
      result,
    };
  },
});

export const reconcileBillTask = schemaTask({
  id: "reconcile-bill",
  schema: z.object({
    billId: z.number(),
  }),
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log(`Reconciling bill ${payload.billId}`, {
      payload,
      ctx,
    });

    const service = getService();
    const result = await service.bill.reconcile(payload.billId);

    return {
      message: "Successfully reconciled bill",
      result,
    };
  },
});
