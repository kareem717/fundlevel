"use server";

import { createServerORPCClient } from "@fundlevel/web/lib/orpc/server";
import { ORPCError } from "@orpc/client";
import { cache } from "react";

export const getSessionFn = cache(async () => {
	const orpc = await createServerORPCClient();
	try {
		const session = await orpc.auth.session.call();
		return session;
	} catch (error) {
		if (error instanceof ORPCError) {
			switch (error.status) {
				case 401:
					return null;
				default:
					throw error;
			}
		}
		throw error;
	}
});
