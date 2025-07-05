import { createClient } from "@fundlevel/auth/client";

export const authClient = createClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
	basePath: "/auth",
});
