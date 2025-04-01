import { createRoute } from "@hono/zod-openapi";
import {
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import { z } from "zod";
import {
  BankTransactionSchema,
  BankAccountSchema,
} from "@fundlevel/db/validators";
import {
  offsetPaginationParamsSchema,
  offsetPaginationResultSchema,
} from "@fundlevel/api/internal/server/types/params";

export const getBankAccountDetailsRoute = createRoute({
  summary: "Get bank account details",
  operationId: "getBankAccountDetails",
  tags: ["Bank Account"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:id",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: BankAccountSchema.openapi("BankAccount"),
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
    }),
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
            data: z.array(BankAccountSchema.openapi("BankAccount")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});