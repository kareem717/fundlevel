import { createClient } from "@fundlevel/auth/client";

export const authClient = (baseUrl: string) =>
	createClient({
		baseURL: baseUrl,
		basePath: "/auth",
	});
