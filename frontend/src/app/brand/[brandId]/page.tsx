import { prefetchBrand, prefetchBrands } from '@/services/brand/queries';
import Client from './client';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    brandId: string;
  }>;
}

const queryClient = getQueryClient();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandId } = await params;
  const brand = await prefetchBrand(queryClient, brandId);

  return {
    title: brand?.name,
    description: `Should I boycott ${brand?.name}?`,
  };
}

export async function generateStaticParams() {
  const brands = await prefetchBrands(queryClient, { select: ['id'] });
  return brands.map((b) => ({ brandId: b.id }));
}

export default async function BrandPage({ params }: Props) {
  const { brandId } = await params;

  await prefetchBrand(queryClient, brandId);

  return (
    <Hydrater queryClient={queryClient}>
      <Client brandId={brandId} />
    </Hydrater>
  );
}
