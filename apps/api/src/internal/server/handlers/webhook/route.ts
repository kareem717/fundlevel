import { z, createRoute } from "@hono/zod-openapi";
import { unauthorizedResponse } from "../../types/errors";

export const plaidWebhookRoute = createRoute({
  summary: "Handle Plaid webhook",
  operationId: "handlePlaidWebhook",
  tags: ["webhooks"],
  method: "post",
  path: "/plaid",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            webhook_type: z.string(),
            webhook_code: z.string(),
            item_id: z.string().optional(),
          }),
        },
      },
    },
    headers: z.object({
      "plaid-verification": z.string().openapi({
        description: "JWT signature for webhook verification",
      }),
    }),
  },
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
  tags: ["webhooks"],
  method: "post",
  path: "/quick-books",
  request: {
    headers: z.object({
      "intuit-signature": z.string().openapi({
        description: "HMAC-SHA256 signature for webhook verification",
      }),
    }),
  },
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
