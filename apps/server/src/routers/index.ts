import { z } from "zod";
import { publicProcedure } from "@/lib/orpc";
import { nangoRouter } from "./nango";

export const appRouter = {
	health: publicProcedure
		.output(z.object({ status: z.literal("OK") }))
		.handler(() => ({ status: "OK" })),
	nango: nangoRouter,
};

export type AppRouter = typeof appRouter;
