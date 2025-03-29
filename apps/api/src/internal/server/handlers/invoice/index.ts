import { OpenAPIHono } from "@hono/zod-openapi";
import { reconcileRoute, getManyRoute } from "./routes";
import { getAccount, getUserId } from "../../middleware/with-auth";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk/v3";
import type { reconcileInvoiceTask } from "@fundlevel/api/internal/jobs/reconciliation";
import { getService } from "../../middleware/with-service-layer";
const invoiceHandler = new OpenAPIHono()
  .openapi(reconcileRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found, please create an account.",
        },
        404,
      );
    }

    const { invoiceId } = c.req.valid("param");

    await tasks.trigger<typeof reconcileInvoiceTask>(
      "reconcile-invoice",
      {
        invoiceId,
      },
      {
        idempotencyKey: await idempotencyKeys.create(
          `reconcile-invoice-${invoiceId}`,
        ),
      },
    );

    return c.json(200);
  })
  .openapi(getManyRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found, please create an account.",
        },
        404,
      );
    }

    const { offset, limit, order } = c.req.valid("query");
    const { companyId } = c.req.valid("param");

    const result = await getService(c).accounting.getManyInvoices({
      offset,
      limit,
      order,
      companyIds: [companyId],
    });

    return c.json(result, 200);
  });

export default invoiceHandler;
