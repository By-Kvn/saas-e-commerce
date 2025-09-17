/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@saas/ui", "@saas/types"],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  // ✅ Updated: Move turbo config to top level
  turbopack: {
    resolveAlias: {
      '@/ui': '../../packages/ui/src',
      '@/types': '../../packages/types/src',
    },
  },
}

module.exports = nextConfig