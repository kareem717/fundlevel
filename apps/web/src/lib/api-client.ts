import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hc } from "hono/client";
import type { AppRouter } from "../../../server/src/index";

export const apiClient = async () =>
	hc<AppRouter>(
		await getCloudflareContext({
			async: true,
		}).then((ctx) => ctx.env.NEXT_PUBLIC_SERVER_URL),
		{
			fetch: (
				input: URL | RequestInfo,
				requestInit?: RequestInit | undefined,
			) =>
				globalThis.fetch(input, {
					...requestInit,
					credentials: "include", // Include cookies for cro
					// ss-origin requests
				}),
		},
	);
