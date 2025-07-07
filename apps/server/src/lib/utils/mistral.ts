import { env } from "cloudflare:workers";
import { Mistral } from "@mistralai/mistralai";

export const createMistralClient = () =>
	new Mistral({
		apiKey: env.MISTRAL_API_KEY,
	});
