import type { User } from "@workos-inc/node";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
	context: HonoContext;
};

export type ORPCContext = {
	user: User | null;
	sessionId: string | null;
	honoCtx: HonoContext;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<ORPCContext> {
	return {
		user: null,
		sessionId: null,
		honoCtx: context,
	};
}
