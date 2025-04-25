import { env } from "@fundlevel/landing/env";
import type { Metadata } from "next";

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

/**
 * Configuration for the root layout meta content.
 */
const root: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_LANDING_URL),
  title: {
    default: "Fundlevel",
    template: "%s | Fundlevel",
  },
  description: "AI tool suite for finance teams",
  keywords: [
    "real estate developer",
    "real estate development",
    "real estate development software",
    "real estate development ai",
    "commercial real estate",
    "commercial real estate software",
    "funding",
    "fundlevel",
    "fund level",
    "controller tools",
    "controller",
    "cfo",
    "cfo tools",
    "finance tools",
    "ai cfo",
    "finance",
    "real estate",
    "development",
  ],
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Contains all configurable data for meta content across the app.
 */
export const meta: Record<string, Metadata> = {
  root,
  error,
  notFound,
};
