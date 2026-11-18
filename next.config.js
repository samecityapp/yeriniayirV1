/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, {isServer}) {
    if (!isServer && process.env.PERFORMANCE_ANALYZE === '1') {
      config.plugins.push({apply(compiler) {compiler.hooks.done.tap('LocalPerformanceStats', stats => {
        require('fs').writeFileSync('work/premium-performance/client-stats.json', JSON.stringify(stats.toJson({all:false,chunks:true,chunkModules:true,modules:true})));
      });}});
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aknhkpevrlpsrfxzqtop.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'jerkkxwgddujigsbeqwo.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {source:'/fonts/Inter-TR-EN-04308d9ab394.woff2',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
      {
        source: '/images/gastronomy/:path*',
        headers: [{key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800'}],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            // Update this to your specific domains in production
            value: 'https://yeriniayir.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          {
            key: 'Content-Security-Policy',
            // Added report-only or stricter directives. 
            // Note: 'unsafe-inline' is often needed for Next.js in some configs, 
            // but we try to restrict it. 
            // Added img-src and others to allow Supabase/Unsplash/etc.
            // Added 'https://www.clarity.ms' to script-src and connect-src for Microsoft Clarity.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google-analytics.com https://*.googletagmanager.com https://www.clarity.ms https://c.bing.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://www.clarity.ms https://c.bing.com; frame-ancestors 'none';",
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/en/guide',
        destination: '/en/rehber',
      },
      {
        source: '/en/guide/:slug*',
        destination: '/en/rehber/:slug*',
      },
      {
        source: '/en/hotel/:slug*',
        destination: '/en/otel/:slug*',
      },
    ];
  },
};

module.exports = nextConfig;
