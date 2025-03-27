import { z } from "@hono/zod-openapi";

export const pathIdParamSchema = z.coerce
  .number()
  .min(1)
  .openapi({
    param: {
      name: "id",
      in: "path",
    },
  });

export const cursorPaginationParamsSchema = z.object({
  cursor: z.coerce.number().nullable().default(null),
  limit: z.coerce.number().optional().default(10),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const cursorPaginationResultSchema = z.object({
  nextCursor: z.number().nullable(),
});

