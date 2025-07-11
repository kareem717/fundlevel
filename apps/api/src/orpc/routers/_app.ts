import { authRouter } from "./auth-router";
import { bankStatementRouter } from "./bank-statement-router";
import { healthRouter } from "./health-router";
import { integrationRouter } from "./integration-router";

export const appRouter = {
	health: healthRouter,
	auth: authRouter,
	integration: integrationRouter,
	bankStatement: bankStatementRouter,
};

export type AppRouter = typeof appRouter;
