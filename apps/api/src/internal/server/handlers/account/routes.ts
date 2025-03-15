import { createRoute } from "@hono/zod-openapi";
import { accountSchema } from "../../../entities/account";
import { notFoundResponse, unauthorizedResponse, bearerAuthSchema } from "../shared/schemas";

export const getAccountRoute = createRoute({
  summary: "Get account",
  operationId: "getAccount",
  tags: ["Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: accountSchema,
        },
      },
    },
    ...notFoundResponse,
  },
});

export const createAccountRoute = createRoute({
  summary: "Create account",
  operationId: "createAccount",
  tags: ["Accounts"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/",
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: accountSchema,
        },
      },
    },
    ...unauthorizedResponse,
  },
});
