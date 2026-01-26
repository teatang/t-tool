import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',

  // Base path - set this to your repo name for GitHub Pages
  // If using custom domain that already points to the repo folder, set to empty string ''
  // For repository at https://github.com/username/t-tool with custom domain, use ''
  basePath: '',

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Disable TypeScript errors in build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
