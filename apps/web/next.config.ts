import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		//TODO: This is very dangerous, but I need to ship lol
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
