import { env } from "@/env";
import { Metadata } from "next";

/**
 * Configuration for landing page meta content.
 */
const landing: Metadata = {
	title: "Fundlevel",
	description: "The best way to fund",
};

const root: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: {
		default: "Fundlevel",
		template: "%s | Fundlevel",
	},
	description: "The best way to fund",
};

/**
 * Contains all configurable data for meta content across the app.
 */
export const meta: Record<string, Metadata> = {
	root,
	landing,
};
