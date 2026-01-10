/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // ❌ TS checking off
  },
  eslint: {
    ignoreDuringBuilds: true,  // ❌ ESLint off
  },
};

module.exports = nextConfig;

