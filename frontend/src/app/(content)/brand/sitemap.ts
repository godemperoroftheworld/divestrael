import { MetadataRoute } from 'next';
import getQueryClient from '@/services/query';
import { prefetchBrands } from '@/services/brand/queries';

const queryClient = getQueryClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch products
  const brands = await prefetchBrands(queryClient, { select: ['id'] });
  return brands.map((brand) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/brand/${brand.id}`,
    lastModified: Date(),
    changeFrequency: 'daily',
    priority: 0.5,
  }));
}
