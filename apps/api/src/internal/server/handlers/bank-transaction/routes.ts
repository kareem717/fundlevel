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

export const getCompanyTransactionsRoute = createRoute({
  summary: "Get company transactions",
  operationId: "getCompanyTransactions",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/company/:companyId",
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
            data: z.array(BankTransactionSchema.openapi("BankTransaction")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getBankAccountTransactionsRoute = createRoute({
  summary: "Get bank account transactions",
  operationId: "getBankTransactions",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-account/:bankAccountId",
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
            data: z.array(BankTransactionSchema.openapi("BankTransaction")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});

export const getTransactionRoute = createRoute({
  summary: "Get bank account transaction",
  operationId: "getTransaction",
  tags: ["Banking"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/:id",
  request: {
    params: z.object({
      transactionId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: BankTransactionSchema.openapi("BankTransaction"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});