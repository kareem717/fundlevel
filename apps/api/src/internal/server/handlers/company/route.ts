import { z, createRoute } from '@hono/zod-openapi'
import { unauthorizedResponse, forbiddenResponse } from '@fundlevel/api/internal/server/types/errors'
import { bearerAuthSchema } from '@fundlevel/api/internal/server/types/security'
import { CompanySchema, CreateCompanyParamsSchema } from '@fundlevel/db/validators'

const intIdSchema = z.coerce.number().int().positive()

export const createCompanyRoute = createRoute({
  summary: 'Create a new company',
  operationId: "createCompany",
  tags: ['Company'],
  security: [bearerAuthSchema],
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCompanyParamsSchema.openapi('CreateCompanyParams'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Company created successfully',
      content: {
        'application/json': {
          schema: CompanySchema.openapi('Company'),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
})

export const getCompaniesByAccountIdRoute = createRoute({
  summary: 'Get companies by account ID',
  operationId: "getCompaniesByAccountId",
  tags: ['Company'],
  security: [bearerAuthSchema],
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Successful fetch',
      content: {
        'application/json': {
          schema: z.array(CompanySchema.openapi('Company')),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
})

export const connectQuickBooksRoute = createRoute({
  summary: 'Connect QuickBooks to a company',
  operationId: "connectQuickBooks",
  tags: ['Company'],
  security: [bearerAuthSchema],
  method: 'post',
  path: '/quickbooks/connect',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            companyId: intIdSchema.describe("The ID of the company"),
            redirectUrl: z.string().describe("The URL to redirect to after authentication")
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Authentication URL generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            url: z.string()
          })
        },
      },
    },
    ...unauthorizedResponse,
  },
})

export const quickBooksCallbackRoute = createRoute({
  summary: 'QuickBooks OAuth callback',
  operationId: "quickBooksCallback",
  tags: ['Company'],
  method: 'get',
  path: '/quickbooks/callback',
  request: {
    query: z.object({
      realmId: z.string().describe("The QuickBooks realm ID"),
      code: z.string().describe("The authorization code"),
      state: z.string().describe("The state token")
    }),
  },
  responses: {
    302: {
      description: 'Redirect to application',
    },
    400: {
      description: 'Bad request - missing parameters',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string()
          }).openapi('ErrorResponse'),
        },
      },
    },
  },
})

export const getCompanyByIdRoute = createRoute({
  summary: 'Get company by ID',
  operationId: "getCompanyById",
  tags: ['Company'],
  security: [bearerAuthSchema],
  method: 'get',
  path: '/:companyId',
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: 'Successful fetch',
      content: {
        'application/json': {
          schema: CompanySchema.openapi('Company'),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
})