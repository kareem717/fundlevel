import { env } from "cloudflare:workers";
import { Nango } from "@nangohq/node";

export const createNangoClient = () =>
	new Nango({
		secretKey: env.NANGO_SECRET_KEY,
	});

export const NangoIntegration = {
	QUICKBOOKS: "quickbooks",
	GOOGLE_SHEETS: "google-sheet",
} as const;
