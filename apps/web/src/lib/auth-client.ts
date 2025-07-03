import { createClient } from "@fundlevel/auth/client";

export const authClient = createClient({
	//TODO: remove this
	baseURL: "http://localhost:3000",
	basePath: "/auth",
});
