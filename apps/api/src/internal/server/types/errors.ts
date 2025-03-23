import { z } from '@hono/zod-openapi'

export const unauthorizedResponse = {
  401: {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
}}

export const notFoundResponse = {
  404: {
  description: 'Not found',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
}}