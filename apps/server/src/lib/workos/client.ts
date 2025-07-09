import { env } from "cloudflare:workers";
import { WorkOS } from "@workos-inc/node";

export const createWorkOS = () =>
	new WorkOS(env.WORKOS_API_KEY, {
		clientId: env.WORKOS_CLIENT_ID,
	});

export const WORKOS_COOKIE_KEY = "flvl-wos-session";
