import { createRoute, z } from "@hono/zod-openapi";
import {
  unauthorizedResponse,
  bearerAuthSchema,
  intPathIdParamSchema,
  forbiddenResponse,
  notFoundResponse,
} from "../shared/schemas";
import { CreateCompanyParamsSchema, CompanySchema } from "../../../entities";

export const createCompanyRoute = createRoute({
  summary: "Create a new linked account manually",
  operationId: "createCompany",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCompanyParamsSchema.required(),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Linked account created successfully",
      content: {
        "application/json": {
          schema: CompanySchema.required(), 
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
      id: intPathIdParamSchema,
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
      id: intPathIdParamSchema,
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
  operationId: "getCompanyById",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
  },
  responses: {
    200: {
      description: "Linked account details",
      content: {
        "application/json": {
          schema: CompanySchema.required(),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const getByAccountIdRoute = createRoute({
  summary: "Get all linked accounts for an account",
  operationId: "getCompaniesByAccountId",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/list",
  responses: {
    200: {
      description: "List of linked accounts",
      content: {
        "application/json": {
          schema: z.array(CompanySchema.required()),
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
      id: intPathIdParamSchema,
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
            success: z.boolean().openapi({ description: "Success" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
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
      id: intPathIdParamSchema,
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

export const deleteCompanyRoute = createRoute({
  summary: "Delete a linked account and all associated credentials",
  operationId: "deleteCompany",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
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

export const connectQuickBooksRoute = createRoute({
  summary: "Connect QuickBooks account",
  operationId: "getQuickBooksAuthUrl",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/{id}/quickbooks/connect",
  request: {
    params: z.object({
      id: intPathIdParamSchema,
    }),
    query: z.object({
      redirect_uri: z.string().min(1).openapi({ description: "Redirect URI" }),
    }),
  },
  responses: {
    200: {
      description: "Linked account created successfully",
      content: {
        "application/json": {
          schema: z.object({
            url: z
              .string()
              .min(1)
              .openapi({ description: "QuickBooks auth URL" }),
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

export const quickBooksCallback = createRoute({
  method: "get",
  path: "/quickbooks/callback",
  tags: ["Linked Accounts"],
  request: {
    query: z.object({
      code: z.string(),
      realmId: z.string(),
      state: z.string(),
    }),
  },
  responses: {
    302: {
      description: "Successful redirect",
      headers: z.object({
        location: z.string(),
      }),
    },
  },
});

export const searchCompaniesRoute = createRoute({
  summary: "Search companies by name",
  operationId: "searchCompanies",
  tags: ["Linked Accounts"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/search",
  request: {
    query: z.object({
      query: z.string().optional().openapi({
        description: "Search query for company name",
        example: "acme",
      }),
    }),
  },
  responses: {
    200: {
      description: "Companies found",
      content: {
        "application/json": {
          schema: z.array(CompanySchema.required()),
        },
      },
    },
    ...unauthorizedResponse,
  },
});
