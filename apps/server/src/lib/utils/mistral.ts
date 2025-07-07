import { env } from "cloudflare:workers";
import { createMistral } from "@ai-sdk/mistral";

export const createMistralAIProvider = () =>
	createMistral({
		apiKey: env.MISTRAL_API_KEY,
	});
