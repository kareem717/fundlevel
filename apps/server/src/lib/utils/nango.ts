import { env } from "cloudflare:workers";
import { Nango } from "@nangohq/node";

export const createNangoClient = () =>
	new Nango({
		secretKey: env.NANGO_SECRET_KEY,
	});

export const NangoIntegration = {
	QUICKBOOKS: "quickbooks",
	QUICKBOOKS_SANDBOX: "quickbooks-sandbox-kw84",
} as const;
