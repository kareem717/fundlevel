import { createRoute, z } from "@hono/zod-openapi";
import { accountSchema, createAccountSchema } from "../../../entities/account";
import { notFoundResponse, unauthorizedResponse, bearerAuthSchema } from "../shared/schemas";
import { linkedAccountSchema } from "../../../entities";

export const createLinkTokenRoute = createRoute({
  summary: "Create a link to link a new account",
  operationId: "createLinkToken",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/link",
  request: {
    query: z.object({
      name: z.string().min(1).openapi({ description: "Name of the organization" }),
    })
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            linkToken: z.string().min(1).openapi({ description: "Link token to link account" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const swapPublicTokenRoute = createRoute({
  summary: "Swap merge.dev public token to complete linked account",
  operationId: "swapPublicToken",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/swap",
  request: {
    query: z.object({
      publicToken: z.string().min(1).openapi({ description: "Public token from merge.dev" }),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: linkedAccountSchema,
        },
      },
    },
    ...unauthorizedResponse,
  },
});
