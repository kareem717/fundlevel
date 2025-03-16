import { z } from "@hono/zod-openapi";

export const pathIdParamSchema = z.coerce
  .number()
  .min(1);

export const bearerAuthSchema = {
  Bearer: [],
};

export const unauthorizedResponse = {
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
  },
};

export const notFoundResponse = {
  404: {
    description: "Not found",
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
  },
};

export const forbiddenResponse = {
  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
  },
};

export const streamResponse = {
  200: {
    description: "Streaming AI response",
    content: {
      "text/event-stream": {
        schema: z.any(),
      },
    },
  },
};
