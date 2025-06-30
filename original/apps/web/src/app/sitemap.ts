import { env } from "@fundlevel/web/env";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { MetadataRoute } from "next";

const BASE_URL = env.NEXT_PUBLIC_WEB_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${BASE_URL}${redirects.compliance.privacy}`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}${redirects.compliance.terms}`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}${redirects.auth.login}`,
      lastModified: new Date(),
    },
  ];
}
