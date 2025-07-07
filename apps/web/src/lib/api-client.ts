import { hc } from "hono/client";
import type { AppRouter } from "../../../server/src/index";

export const apiClient = (baseUrl: string) =>
	hc<AppRouter>(baseUrl, {
		fetch: (input: URL | RequestInfo, requestInit?: RequestInit | undefined) =>
			globalThis.fetch(input, {
				...requestInit,
				credentials: "include", // Include cookies for cro
				// ss-origin requests
			}),
	});
