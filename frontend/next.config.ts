import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:route*',
        destination: `${process.env.DIVESTRAEL_BACKEND_URL as string}/api/:route*`,
      },
    ];
  },
};

export default nextConfig;
