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
  headers: async () => [
    {
      source: '/(.*).png',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600',
        },
      ],
    },
  ],
};

export default nextConfig;
