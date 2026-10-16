import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-side packages that should not be bundled
  serverExternalPackages: ['bcryptjs'],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
