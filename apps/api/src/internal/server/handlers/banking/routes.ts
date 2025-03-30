import { createRoute } from "@hono/zod-openapi";
import {
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import { z } from "zod";
import {
  PlaidTransactionSchema,
  PlaidBankAccountSchema,
} from "@fundlevel/db/validators";
import {
  offsetPaginationParamsSchema,
  offsetPaginationResultSchema,
} from "@fundlevel/api/internal/server/types/params";

export const getManyCompanyTransactionsRoute = createRoute({
  summary: "Get company transactions",
  operationId: "getCompanyTransactions",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/company/:companyId/transactions",
  request: {
    query: z.object({
      ...offsetPaginationParamsSchema.shape,
      minAuthorizedAt: z.string().optional(),
      maxAuthorizedAt: z.string().optional(),
      minAmount: z.number().optional(),
      maxAmount: z.number().optional(),
      bankAccountIds: z.array(z.string()).optional(),
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
            data: z.array(PlaidTransactionSchema.openapi("BankTransaction")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getManyBankAccountTransactionsRoute = createRoute({
  summary: "Get bank account transactions",
  operationId: "getBankAccountTransactions",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-account/:bankAccountId/transactions",
  request: {
    query: z.object({
      ...offsetPaginationParamsSchema.shape,
      minAuthorizedAt: z.string().optional(),
      maxAuthorizedAt: z.string().optional(),
      minAmount: z.number().optional(),
      maxAmount: z.number().optional(),
    }),
    params: z.object({
      bankAccountId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(PlaidTransactionSchema.openapi("PlaidTransaction")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getBankAccountDetailsRoute = createRoute({
  summary: "Get bank account details",
  operationId: "getBankAccountDetails",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-account/:bankAccountId",
  request: {
    params: z.object({
      bankAccountId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: PlaidBankAccountSchema.openapi("BankAccount"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
