import { OpenAPIHono } from "@hono/zod-openapi";
import { reconcileRoute, getManyRoute, getRoute, getLineItemsRoute } from "./routes";
import { getAccount } from "../../middleware/with-auth";
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

    try {
      const { id, publicAccessToken } = await tasks.trigger<typeof reconcileInvoiceTask>(
        "reconcile-invoice",
        {
          invoiceId,
        },
        // {
        //   idempotencyKey: await idempotencyKeys.create(
        //     `reconcile-invoice-${invoiceId}`,
        //   ),
        // },
      );

      return c.json({
        taskId: id,
        publicAccessToken,
      }, 200);
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong")
    }
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

    const { page, pageSize, order } = c.req.valid("query");
    const { companyId } = c.req.valid("param");

    const result = await getService(c).invoice.getMany({
      page,
      pageSize,
      order,
      companyIds: [companyId],
    });

    return c.json(result, 200);
  })
  .openapi(getRoute, async (c) => {
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

    const result = await getService(c).invoice.get(invoiceId);

    return c.json(result, 200);
  })
  .openapi(getLineItemsRoute, async (c) => {
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

    const result = await getService(c).invoice.getManyLines({ invoiceId });

    return c.json(result, 200);
  });

export default invoiceHandler;
