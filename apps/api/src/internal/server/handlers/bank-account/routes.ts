import { createRoute } from "@hono/zod-openapi";
import {
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import { z } from "zod";
import {
  BankAccountSchema,
} from "@fundlevel/db/validators";
import {
  offsetPaginationParamsSchema,
  offsetPaginationResultSchema,
} from "@fundlevel/api/internal/server/types/params";
import { pathIdParamSchema } from "@fundlevel/api/internal/server/types/params";

export const getBankAccountDetailsRoute = createRoute({
  summary: "Get bank account details",
  operationId: "getBankAccountDetails",
  tags: ["Bank Account"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:id",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: BankAccountSchema.omit({ remainingRemoteContent: true }).openapi("BankAccount"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getCompanyBankAccountsRoute = createRoute({
  summary: "Get company bank accounts",
  operationId: "getCompanyBankAccounts",
  tags: ["Bank Account"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/company/:companyId",
  request: {
    query: z.object({
      ...offsetPaginationParamsSchema.shape,
      sortBy: z.enum(["transactions", "id"]),
    }),
    params: z.object({
      companyId: pathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(BankAccountSchema.omit({ remainingRemoteContent: true }).openapi("BankAccount")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});
