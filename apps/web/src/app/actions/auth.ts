"use server";

import { createClient } from "@fundlevel/auth/client";
import { headers } from "next/headers";
import { cache } from "react";

export const getSessionFn = cache(async () => {
	return await createClient({
		baseURL: "http://localhost:3000",
		basePath: "/auth",
	}).getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});
});
