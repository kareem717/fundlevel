import { createMistral } from "@ai-sdk/mistral";
import env from "@fundlevel/api/env";

export const createMistralAIProvider = () =>
	createMistral({
		apiKey: env.MISTRAL_API_KEY,
	});
