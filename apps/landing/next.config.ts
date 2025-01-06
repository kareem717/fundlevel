import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'perawallet.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'pipe.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
    ],
  },
}

export default nextConfig
