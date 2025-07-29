import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [],
      },
    ],
    sitemap: [
      `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_URL}/product/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_URL}/brand/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_URL}/company/sitemap.xml`,
    ],
  };
}
