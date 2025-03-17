import { createRoute, z } from "@hono/zod-openapi";
import { bearerAuthSchema, forbiddenResponse, intPathIdParamSchema, streamResponse, stringPathIdParamSchema } from "../shared/schemas";
import { unauthorizedResponse, notFoundResponse } from "../shared/schemas";

// Define the message schema for AI requests
const messageSchema = z
  .object({
    content: z.string(),
    role: z.enum(["system", "user", "assistant", "data"]),
    id: z.string(),
  })
  .catchall(z.unknown());

// Route for analyzing balance sheets
export const analyzeBalanceSheetRoute = createRoute({
  summary: "Analyze a company's balance sheet",
  operationId: "analyzeBalanceSheet",
  tags: ["AI", "Finance"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/company/{id}/balance-sheet",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            messages: messageSchema.array(),
          }),
        },
      },
    },
  },
  responses: {
    ...streamResponse,
    ...forbiddenResponse,
    ...unauthorizedResponse,
  },
});

// Route for analyzing financial health
export const analyzeFinancialHealthRoute = createRoute({
  summary: "Analyze a company's overall financial health",
  operationId: "analyzeFinancialHealth",
  tags: ["AI", "Finance"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/company/{id}/financial-health",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            messages: messageSchema.array(),
          }),
        },
      },
    },
  },
  responses: {
    ...streamResponse,
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

// Route for projecting cash flow
export const projectCashFlowRoute = createRoute({
  summary: "Project future cash flow based on historical data",
  operationId: "projectCashFlow",
  tags: ["AI", "Finance"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/company/{id}/cash-flow",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            messages: messageSchema.array(),
          }),
        },
      },
    },
  },
  responses: {
    ...streamResponse,
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

// Route for reconciling transactions
export const reconcileTransactionsRoute = createRoute({
  summary: "Reconcile bank transactions with invoices",
  operationId: "reconcileTransactions",
  tags: ["AI", "Finance"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/bank-account/{id}/reconcile",
  request: {
    params: z.object({
      id: stringPathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Successful reconciliation",
      content: {
        "application/json": {
          schema: z.any(),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
