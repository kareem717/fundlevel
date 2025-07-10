"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { cache } from "react";

export const getCookieHeaderFn = cache(async () => {
	const headersList = await headers();
	const headersObject: Record<string, string> = {};
	headersList.forEach((value, key) => {
		if (key === "cookie") {
			headersObject[key] = value;
		}
	});
	return headersObject;
});

export const getEnvFn = cache(async () => {
	const { env } = await getCloudflareContext({ async: true });
	return env;
});
