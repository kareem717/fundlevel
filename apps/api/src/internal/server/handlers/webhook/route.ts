import { z, createRoute } from "@hono/zod-openapi";
import { unauthorizedResponse } from "../../types/errors";

export const plaidWebhookRoute = createRoute({
  summary: "Handle Plaid webhook",
  operationId: "handlePlaidWebhook",
  tags: ["Webhooks"],
  method: "post",
  path: "/plaid",
  hide: true,
  responses: {
    200: {
      description: "Webhook processed successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    400: {
      description: "Bad request - missing webhook type or code",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const quickBooksWebhookRoute = createRoute({
  summary: "Handle QuickBooks webhook",
  operationId: "handleQuickBooksWebhook",
  tags: ["Webhooks"],
  method: "post",
  path: "/quick-books",
  hide: true,
  responses: {
    200: {
      description: "Webhook processed successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    400: {
      description: "Bad request - missing webhook type or code",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});
