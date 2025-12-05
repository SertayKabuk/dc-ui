import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [new URL('https://cdn.discordapp.com')]
  }
};

export default nextConfig;
