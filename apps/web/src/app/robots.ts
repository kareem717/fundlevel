import type { MetadataRoute } from "next";
import { env } from "@/env";
import { redirects } from "@/lib/config/redirects";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: [
					`${redirects.auth.callback}`,
					`${redirects.auth.logout}`,
					`${redirects.auth.createAccount}`,
				],
			},
		],
		sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
		// {
		//   rules:
		//     | {
		//         userAgent?: string | string[]
		//         allow?: string | string[]
		//         disallow?: string | string[]
		//         crawlDelay?: number
		//       }
		//     | Array<{
		//         userAgent: string | string[]
		//         allow?: string | string[]
		//         disallow?: string | string[]
		//         crawlDelay?: number
		//       }>
		//   sitemap?: string | string[]
		//   host?: string
		// }
	};
}
