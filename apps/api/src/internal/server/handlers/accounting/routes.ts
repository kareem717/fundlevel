import { createRoute, z } from "@hono/zod-openapi";
import {
  bearerAuthSchema,
  intPathIdParamSchema,
  stringPathIdParamSchema,
  unauthorizedResponse,
} from "../shared/schemas";
import { PlaidBankAccountSchema, PlaidTransactionSchema } from "../../../entities";

// Route for getting bank accounts for a company
export const getBankAccountsForCompanyRoute = createRoute({
  summary: "Get bank accounts for a company",
  operationId: "getBankAccountsForCompany",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/company/{id}",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "List of bank accounts for the company",
      content: {
        "application/json": {
          schema: z.array(PlaidBankAccountSchema.required()),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

// Route for getting a specific bank account
export const getBankAccountRoute = createRoute({
  summary: "Get a specific bank account",
  operationId: "getBankAccount",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/{id}",
  request: {
    params: z.object({
      id: stringPathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Bank account details",
      content: {
        "application/json": {
          schema: PlaidBankAccountSchema.required(),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

// Route for getting transactions for a bank account
export const getTransactionsRoute = createRoute({
  summary: "Get transactions for a bank account",
  operationId: "getTransactions",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/{id}/transactions",
  request: {
    params: z.object({
      id: stringPathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "List of transactions for the bank account",
      content: {
        "application/json": {
          schema: z.array(PlaidTransactionSchema.required()),
        },
      },
    },
    ...unauthorizedResponse,
  },
});
