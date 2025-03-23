import { createRoute } from '@hono/zod-openapi'
import { notFoundResponse, unauthorizedResponse } from '@fundlevel/api/internal/server/types/errors'
import { bearerAuthSchema } from '@fundlevel/api/internal/server/types/security'
import { AccountSchema, CreateAccountParamsSchema } from '@fundlevel/db/validators'

export const getAccountRoute = createRoute({
  summary: 'Get account',
  operationId: "getAccount",
  tags: ['Accounts'],
  security: [bearerAuthSchema],
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Successful fetch',
      content: {
        'application/json': {
          schema: AccountSchema.required().openapi("Account"),
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
})

export const createAccountRoute = createRoute({
  summary: 'Create account',
  operationId: "createAccount",
  tags: ['Accounts'],
  security: [bearerAuthSchema],
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAccountParamsSchema.openapi("CreateAccountParams"),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful fetch',
      content: {
        'application/json': {
          schema: AccountSchema.openapi("Account"),
        },
      },
    },
    ...unauthorizedResponse,
  },
})