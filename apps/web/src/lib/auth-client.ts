import { createClient } from "@fundlevel/auth/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const authClient = () =>
	createClient({
		baseURL: getCloudflareContext().env.NEXT_PUBLIC_SERVER_URL,
		basePath: "/auth",
	});
