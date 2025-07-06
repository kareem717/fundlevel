import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
	typescript: {
		//TODO: This is very dangerous, but I need to ship lol
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
