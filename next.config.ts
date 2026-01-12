import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript and ESLint are now enabled for production builds
  
  // IMAGE OPTIMIZATION: Critical for LCP
  images: {
    // Enable modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images (matches common mobile breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes for the sizes attribute
    imageSizes: [16, 32, 48, 64, 96, 112, 128, 256],
    // Minimize layout shift
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // EXPERIMENTAL: Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
};

export default nextConfig;

