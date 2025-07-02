import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { gmailRouter } from "./gmail";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	...gmailRouter,
};
export type AppRouter = typeof appRouter;
