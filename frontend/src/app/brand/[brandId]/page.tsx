import { prefetchBrand, prefetchBrands } from '@/services/brand/queries';
import Client from './client';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';

interface Props {
  params: Promise<{
    brandId: string;
  }>;
}

const queryClient = getQueryClient();

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
