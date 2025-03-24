import type { MetadataRoute } from "next";
import { env } from "@fundlevel/landing/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_LANDING_URL}/sitemap.xml`,
  };
}
