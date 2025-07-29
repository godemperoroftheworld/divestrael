import { MetadataRoute } from 'next';
import getQueryClient from '@/services/query';
import { prefetchCompanies } from '@/services/company/queries';

const queryClient = getQueryClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch products
  const companies = await prefetchCompanies(queryClient, { select: ['id'] });
  return companies.map((company) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/company/${company.id}`,
    lastModified: Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));
}
