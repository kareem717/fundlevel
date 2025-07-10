"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { apiClient } from "@/lib/api-client";
import { getCookieHeaderFn } from "./utils";

export async function getNangoSessionToken(
	integration: "quickbooks" | "google-sheet",
) {
	const { env } = await getCloudflareContext({ async: true });
	const headers = await getCookieHeaderFn();
	const resp = await apiClient(
		env.NEXT_PUBLIC_SERVER_URL,
		headers,
	).integrations[":integration"]["session-token"].$post({
		param: {
			integration,
		},
	});

	if (!resp.ok) {
		throw new Error(await resp.text());
	}

	return resp.json();
}
