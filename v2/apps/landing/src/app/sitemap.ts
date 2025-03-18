import { env } from "@/env";
import { redirects } from "@/lib/config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${env.NEXT_PUBLIC_APP_URL}${redirects.home}`,
      lastModified: new Date(),
    },
  ];
}
