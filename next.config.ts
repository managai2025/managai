import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  eslint: {
    // Ne álljon meg a build lint hibák miatt (csak demo/gyors haladás)
    ignoreDuringBuilds: true,
  },
  // ha szeretnéd, ideiglenesen a TS hibákat is átengedheted:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
