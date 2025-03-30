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

export const offsetPaginationParamsSchema = z.object({
  page: z.coerce.number().min(0).optional().default(0).describe("The page number to return, 0-indexed"),
  pageSize: z.coerce.number().min(1).max(100).optional().default(10).describe("The number of records to return per page, max 100"),
  order: z.enum(["asc", "desc"]).optional().default("asc").describe("The order to return the records in"),
});

export const offsetPaginationResultSchema = z.object({
  totalPages: z.number(),
  totalRecords: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  currentPage: z.number(),
});
