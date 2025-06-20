import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable SSR caching
  experimental: {
    // Force dynamic rendering
    isrMemoryCacheSize: 0,
  },
  // Disable static generation for dynamic content
  output: 'standalone',
  // Disable caching for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
