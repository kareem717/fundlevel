import { createAuthClient } from "better-auth/react";
import { getBindings } from "@/utils/bindings";

export const authClient = createAuthClient({
	baseURL: getBindings().SERVER_URL,
});
