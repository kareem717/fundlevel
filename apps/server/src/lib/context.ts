import type { Context as HonoContext } from "hono";
import { createAuthClient } from "./auth";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await createAuthClient().api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
