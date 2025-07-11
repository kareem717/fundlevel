import { z } from "zod";

export const RedirectResponseSchema = z.object({
	location: z.string().url().describe("URL to redirect to"),
	shouldRedirect: z.boolean().describe("Whether to redirect to the URL"),
});
