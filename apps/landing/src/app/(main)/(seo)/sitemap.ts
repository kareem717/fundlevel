import {redirects} from "@/lib/config";
import { env } from "@/env";
import { MetadataRoute } from "next";

const BASE_URL = env.NEXT_PUBLIC_APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: `${BASE_URL}${redirects.home}`,
			lastModified: new Date(),
		},
	];
}
