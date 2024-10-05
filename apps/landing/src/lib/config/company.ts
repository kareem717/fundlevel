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
		link: "#",
		icon: "xTwitter",
	},
	{
		link: "#",
		icon: "linkedin",
	},
];

/**
 * Configuration for all contact information for the app.
 */
export const contact = {
	email: "team@fundlevel.app",
	calendly: "https://calendly.com/fundlevel/30min",
	socials,
};

/**
 * Configuration for all business information for the app.
 */
export const business = {
	name: "Fund Level",
  copyright: "© 2024 Fund Level. All rights reserved.",
};
