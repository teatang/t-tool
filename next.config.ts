import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',

  // Base path - set this to your repo name for GitHub Pages
  // For repository at https://github.com/username/t-tool, use '/t-tool'
  basePath: '/t-tool',

  // Asset prefix for static resources
  assetPrefix: '/t-tool/',

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Disable TypeScript errors in build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint errors in build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
