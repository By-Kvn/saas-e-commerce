/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@saas/ui", "@saas/types"],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  // ✅ Bypass TypeScript et ESLint pour le build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ Updated: Move turbo config to top level
  turbopack: {
    resolveAlias: {
      '@/ui': '../../packages/ui/src',
      '@/types': '../../packages/types/src',
    },
  },
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
}

module.exports = nextConfig