"use server";

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
