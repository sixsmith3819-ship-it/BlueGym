import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: false, // Disable Turbopack, use Webpack
  },
};

export default nextConfig;
