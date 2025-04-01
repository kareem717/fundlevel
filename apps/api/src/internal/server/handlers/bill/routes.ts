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
import { BillSchema, BillLineSchema } from "@fundlevel/db/validators";

export const reconcileRoute = createRoute({
  summary: "Reconcile bill",
  operationId: "reconcileBill",
  tags: ["Bill"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/:billId/reconcile",
  request: {
    params: z.object({
      billId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful reconcile",
      content: {
        "application/json": {
          schema: z.object({
            taskId: z.string(),
            publicAccessToken: z.string()
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getManyRoute = createRoute({
  summary: "Get company bills",
  operationId: "getCompanyBills",
  tags: ["Bill"],
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
            data: z.array(BillSchema.openapi("Bill")),
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
  summary: "Get bill",
  operationId: "getBill",
  tags: ["Bill"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:billId",
  request: {
    params: z.object({
      billId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: BillSchema.openapi("Bill"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getLinesRoute = createRoute({
  summary: "Get bill lines",
  operationId: "getBillLines",
  tags: ["Bill"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:billId/lines",
  request: {
    params: z.object({
      billId: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(BillLineSchema.openapi("BillLine")),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    
  },
});
