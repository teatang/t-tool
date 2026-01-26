import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',

  // Base path for GitHub Pages deployment
  basePath: repoName ? `/${repoName}` : '',

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
