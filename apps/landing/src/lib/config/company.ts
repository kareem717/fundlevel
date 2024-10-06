import { Icons } from "@/components/icons";

type Social = {
	link: string;
	icon: keyof typeof Icons;
};

/**
 * Configuration for all social media links for the app.
 */
const socials: Social[] = [
	{
		link: "https://x.com/fundlevel",
		icon: "xTwitter",
	},
	{
		link: "https://linkedin.com/company/fundlevel",
		icon: "linkedin",
	},
];

/**
 * Configuration for all contact information for the app.
 */
export const contact = {
	email: "admin@fundlevel.app",
	calendly: "https://calendly.com/fundlevel/30min",
	socials,
};

/**
 * Configuration for all business information for the app.
 */
export const business = {
	name: "Fundlevel",
  copyright: "© 2024 Fundlevel Inc. All rights reserved.",
};
