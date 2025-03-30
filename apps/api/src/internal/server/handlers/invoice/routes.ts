import { createRoute } from "@hono/zod-openapi";
import {
  notFoundResponse,
  unauthorizedResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import { z } from "zod";
import {
  offsetPaginationParamsSchema,
  offsetPaginationResultSchema,
} from "@fundlevel/api/internal/server/types/params";
import { InvoiceSchema } from "@fundlevel/db/validators";

export const reconcileRoute = createRoute({
  summary: "Reconcile invoice",
  operationId: "reconcileInvoice",
  tags: ["Invoice"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/:invoiceId/reconcile",
  request: {
    params: z.object({
      invoiceId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful reconcile",
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getManyRoute = createRoute({
  summary: "Get company invoices",
  operationId: "getCompanyInvoices",
  tags: ["Invoice"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/company/:companyId",
  request: {
    query: offsetPaginationParamsSchema,
    params: z.object({
      companyId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(InvoiceSchema.openapi("Invoice")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getRoute = createRoute({
  summary: "Get invoice",
  operationId: "getInvoice",
  tags: ["Invoice"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:invoiceId",
  request: {
    params: z.object({
      invoiceId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: InvoiceSchema.openapi("Invoice"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});
