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

export const offsetPaginationParamsSchema = z.object({
  offset: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(10),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const offsetPaginationResultSchema = z.object({
  totalPages: z.number(),
  totalRecords: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  currentPage: z.number(),
});
