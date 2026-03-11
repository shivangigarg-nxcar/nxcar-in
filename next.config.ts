import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'a72c5d09-9552-4a84-9d91-60d56a94ac6e-00-n32hagii0sjb.kirk.replit.dev',
    '.kirk.replit.dev',
    '.replit.dev',
    '127.0.0.1',
    'localhost',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'prod-nxcar-listing.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'www.nxcar.in' },
      { protocol: 'https', hostname: 'nxcar.in' },
      { protocol: 'https', hostname: 'api.nxcar.in' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['lucide-react', 'framer-motion', '@tanstack/react-query', 'date-fns', 'recharts'],
  },
  rewrites: async () => [
    {
      source: '/p1rtn5rs-:slug(.*)',
      destination: '/partners-account',
    },
    {
      source: '/nxcar-t3rms-:slug(.*)',
      destination: '/terms-of-use',
    },
  ],
  redirects: async () => [],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' },
      ],
    },
  ],
};

export default nextConfig;
