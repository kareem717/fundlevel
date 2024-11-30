import { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "perawallet.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pipe.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
