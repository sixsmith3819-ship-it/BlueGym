import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use webpack for builds (Turbopack not needed in production)
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
