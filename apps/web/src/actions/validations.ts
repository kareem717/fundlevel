import { z } from "zod";

export const pathIdSchema = z.number().int().min(1);

export const offsetPaginationSchema = z.object({
	page: z.number().int().min(1),
	pageSize: z.number().int().min(1),
});
