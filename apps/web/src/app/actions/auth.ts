"use server";

import { authClient } from "@web/lib/auth-client";
import { headers } from "next/headers";
import { cache } from "react";

export const getSessionFn = cache(
	async () =>
		await authClient.getSession({
			fetchOptions: {
				headers: await headers(),
			},
		}),
);
