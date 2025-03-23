import { z } from '@hono/zod-openapi'

export const pathIdParamSchema = z
  .coerce
  .number()
  .min(1)
  .openapi({
    param: {
      name: 'id',
      in: 'path',
    },
  })