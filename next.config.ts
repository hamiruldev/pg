import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Static Site Generation
  output: 'export',
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Compression
  compress: true,
  
  // Static export configuration
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
