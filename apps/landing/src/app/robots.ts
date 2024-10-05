import type { MetadataRoute } from "next";
import { env } from "@/env";
import { redirects } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
			},
		],
		sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
	};
}
