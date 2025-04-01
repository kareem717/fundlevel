import { createRoute } from "@hono/zod-openapi";
import {
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import { z } from "zod";
import {
  BankTransactionSchema
} from "@fundlevel/db/validators";
import {
  offsetPaginationParamsSchema,
  offsetPaginationResultSchema,
} from "@fundlevel/api/internal/server/types/params";
import { pathIdParamSchema } from "@fundlevel/api/internal/server/types/params";
import {
  CreateBankTransactionRelationshipParamsSchema
} from "@fundlevel/db/validators";

export const getCompanyTransactionsRoute = createRoute({
  summary: "Get company transactions",
  operationId: "getCompanyTransactions",
  tags: ["Bank Transaction"],
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
      bankAccountIds: z.array(pathIdParamSchema).optional(),
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
            data: z.array(BankTransactionSchema.omit({ remainingRemoteContent: true }).openapi("BankTransaction")),
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
  tags: ["Bank Transaction"],
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
      bankAccountId: pathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(BankTransactionSchema.omit({ remainingRemoteContent: true }).openapi("BankTransaction")),
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
  tags: ["Bank Transaction"],
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
          schema: BankTransactionSchema.omit({ remainingRemoteContent: true }).openapi("BankTransaction"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const createTransactionRelationshipRoute = createRoute({
  summary: "Create a relationship between a bank transaction and an invoice",
  operationId: "createTransactionRelationship",
  tags: ["Bank Transaction"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/:id/relationships",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateBankTransactionRelationshipParamsSchema.openapi("CreateBankTransactionRelationshipParams"),
        },
      },
    }
  },
  responses: {
    200: {
      description: "Successful create",
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getInvoiceTransactionsRoute = createRoute({
  summary: "Get invoice transactions",
  operationId: "getInvoiceTransactions",
  tags: ["Bank Transaction"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/invoice/:invoiceId",
  request: {
    params: z.object({
      invoiceId: pathIdParamSchema,
    }),
    query: z.object({
      ...offsetPaginationParamsSchema.shape,
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(BankTransactionSchema.omit({ remainingRemoteContent: true }).openapi("BankTransaction")),
            ...offsetPaginationResultSchema.shape,
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});