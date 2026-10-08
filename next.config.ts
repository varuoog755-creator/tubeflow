import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Already validated locally via npm run build
    ignoreBuildErrors: false,
  },
  // Ensure serverless edge and Node APIs bundle properly without turbopack-only experimental flags
};

export default nextConfig;
