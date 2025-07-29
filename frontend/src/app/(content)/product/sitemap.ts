import { MetadataRoute } from 'next';
import getQueryClient from '@/services/query';
import { prefetchProducts } from '@/services/product/queries';

const queryClient = getQueryClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch products
  const products = await prefetchProducts(queryClient, { select: ['id'] });
  return products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/product/${product.id}`,
    lastModified: Date(),
    changeFrequency: 'daily',
    priority: 0.3,
  }));
}
