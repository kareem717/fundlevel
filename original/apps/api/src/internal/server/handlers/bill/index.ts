import { OpenAPIHono } from "@hono/zod-openapi";
import {
  reconcileRoute,
  getManyRoute,
  getRoute,
  getLinesRoute,
} from "./routes";
import { getAccount } from "../../middleware/with-auth";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk/v3";
import type { reconcileBillTask } from "@fundlevel/api/internal/jobs/reconciliation";
import { getService } from "../../middleware/with-service-layer";

const billHandler = new OpenAPIHono()
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

    const { billId } = c.req.valid("param");

    try {
      const { id, publicAccessToken } = await tasks.trigger<
        typeof reconcileBillTask
      >(
        "reconcile-bill",
        {
          billId,
        },
        // {
        //   idempotencyKey: await idempotencyKeys.create(
        //     `reconcile-invoice-${invoiceId}`,
        //   ),
        // },
      );

      return c.json(
        {
          taskId: id,
          publicAccessToken,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong");
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

    const result = await getService(c).bill.getMany({
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

    const { billId } = c.req.valid("param");

    const result = await getService(c).bill.get(billId);

    return c.json(result, 200);
  })
  .openapi(getLinesRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found, please create an account.",
        },
        404,
      );
    }

    const { billId } = c.req.valid("param");

    const result = await getService(c).bill.getManyLines({ billId });

    return c.json(result, 200);
  });

export default billHandler;
