import type { MetadataRoute } from "next";
import { env } from "@fundlevel/web/env";
import { redirects } from "@fundlevel/web/lib/config/redirects";

const appUrl = env.NEXT_PUBLIC_WEB_URL;


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
    sitemap: `${appUrl}/sitemap.xml`,
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
