import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: process.env.DIVESTRAEL_BACKEND_URL as string,
      },
    ];
  },
};

export default nextConfig;
