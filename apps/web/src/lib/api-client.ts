import { hc } from "hono/client";
import type { AppRouter } from "../../../server/src/index";

export const apiClient = (baseUrl: string, headers: Record<string, string>) =>
	hc<AppRouter>(baseUrl, {
		fetch: (
			input: URL | RequestInfo,
			requestInit?: RequestInit | undefined,
		) => {
			return globalThis.fetch(input, {
				...requestInit,
				headers: {
					...requestInit?.headers,
					...headers,
				},
				credentials: "include",
			});
		},
	});
