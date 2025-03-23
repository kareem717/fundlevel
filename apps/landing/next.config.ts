import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fundlevel/ui"],
  output: "standalone",
};

export default nextConfig;
