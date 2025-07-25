import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:route*',
        destination: `${process.env.DIVESTRAEL_BACKEND_URL as string}/api/:route*`,
      },
      {
        source: '/image/:url',
        destination: `https://img.logo.dev/:url?token=${process.env.IMAGE_TOKEN}`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:route*',
        headers: [
          {
            key: 'x-api-key',
            value: process.env.API_KEY as string,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
