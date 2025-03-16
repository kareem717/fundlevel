import { createRoute, z } from "@hono/zod-openapi";
import {
  unauthorizedResponse,
  bearerAuthSchema,
  pathIdParamSchema,
  forbiddenResponse,
  notFoundResponse,
} from "../shared/schemas";
import {
  createLinkedAccounttSchema,
  linkedAccountSchema,
} from "../../../entities";

export const createLinkedAccountRoute = createRoute({
  summary: "Create a new linked account manually",
  operationId: "createLinkedAccount",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createLinkedAccounttSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Linked account created successfully",
      content: {
        "application/json": {
          schema: linkedAccountSchema,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const createMergeLinkTokenRoute = createRoute({
  summary: "Create a link to link a new account",
  operationId: "createMergeLinkToken",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/{id}/link/merge",
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
          schema: z.object({
            linkToken: z
              .string()
              .min(1)
              .openapi({ description: "Link token to link account" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const createPlaidLinkTokenRoute = createRoute({
  summary: "Create a Plaid link token to connect a bank account",
  operationId: "createPlaidLinkToken",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/{id}/link/plaid",
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
          schema: z.object({
            linkToken: z
              .string()
              .min(1)
              .openapi({ description: "Plaid link token to connect account" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getByIdRoute = createRoute({
  summary: "Get linked account by ID",
  operationId: "getLinkedAccountById",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Linked account details",
      content: {
        "application/json": {
          schema: linkedAccountSchema,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const getByAccountIdRoute = createRoute({
  summary: "Get all linked accounts for an account",
  operationId: "getLinkedAccountsByAccountId",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/list",
  responses: {
    200: {
      description: "List of linked accounts",
      content: {
        "application/json": {
          schema: z.array(linkedAccountSchema),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const swapPlaidPublicTokenRoute = createRoute({
  summary: "Swap a Plaid public token for an access token",
  operationId: "swapPlaidPublicToken",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/{id}/credentials/plaid",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
    query: z.object({
      public_token: z
        .string()
        .min(1)
        .openapi({ description: "Plaid public token" }),
    }),
  },
  responses: {
    201: {
      description: "Plaid credentials created successfully",
      content: {
        "application/json": {
          schema: z.object({
            access_token: z
              .string()
              .min(1)
              .openapi({ description: "Plaid access token" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...forbiddenResponse
  },
});


export const deletePlaidCredentialsRoute = createRoute({
  summary: "Delete Plaid credentials for a linked account",
  operationId: "deletePlaidCredentials",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "delete",
  path: "/{id}/credentials/plaid",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
  },
  responses: {
    204: {
      description: "Credentials deleted successfully",
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

export const deleteMergeCredentialsRoute = createRoute({
  summary: "Delete Merge credentials for a linked account",
  operationId: "deleteMergeCredentials",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "delete",
  path: "/{id}/credentials/merge",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
  },
  responses: {
    204: {
      description: "Credentials deleted successfully",
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

export const deleteLinkedAccountRoute = createRoute({
  summary: "Delete a linked account and all associated credentials",
  operationId: "deleteLinkedAccount",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: pathIdParamSchema,
    }),
  },
  responses: {
    204: {
      description: "Linked account deleted successfully",
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});