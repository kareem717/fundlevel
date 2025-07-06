import { createClient } from "@fundlevel/auth/client";
import { env } from "./env";

export const authClient = createClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	basePath: "/auth",
});
