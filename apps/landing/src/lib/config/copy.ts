import { env } from "@/env";

/**
 * Contains all of the copy written for the landing page.
 */
const landing = {
	hero: {
		meetingCTA: "Book meeting",
		newsletter: {
			CTA: "Subscribe to newsletter",
			signUpURL: env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL,
		},
	},
};

/**
 * Contains all of the copy written for the app.
 */
export const copy = {
	landing,
};
