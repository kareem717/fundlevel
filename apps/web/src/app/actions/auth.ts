"use server";

import { createClient } from "@fundlevel/auth/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { cache } from "react";

export const getSessionFn = cache(async () => {
	const { env } = await getCloudflareContext({ async: true });

	return await createClient({
		baseURL: env.NEXT_PUBLIC_SERVER_URL,
		basePath: "/auth",
	}).getSession({
		fetchOptions: {
			headers: await headers(),
			credentials: "include",
		},
	});
});
