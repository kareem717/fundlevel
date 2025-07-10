"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";
import { apiClient } from "@/lib/api-client";
import { getCookieHeaderFn } from "./utils";

export const getSessionFn = cache(async () => {
	const { env } = await getCloudflareContext({ async: true });

	const headersList = await getCookieHeaderFn();

	const resp = await apiClient(
		env.NEXT_PUBLIC_SERVER_URL,
		headersList,
	).auth.session.$get();

	if (!resp.ok) {
		if (resp.status === 403) {
			return null;
		}

		const json = await resp.json();
		throw new Error(json.message);
	}

	const { session } = await resp.json();
	return session;
});
