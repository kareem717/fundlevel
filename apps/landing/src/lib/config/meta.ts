import { env } from "@/env";
import { Metadata } from "next";

/**
 * Configuration for error page meta content.
 */
const error: Metadata = {
	title: "Error",
	description: "An error occurred while loading the page.",
};

/**
 * Configuration for not-found/404 page meta content.
 */
const notFound: Metadata = {
	title: "Not Found",
	description: "The page you are looking for does not exist.",
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
	error,
	notFound,
};
