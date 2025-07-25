import { prefetchBrand } from '@/services/brand/queries';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Client from './client';

interface Props {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function BrandPage({ params }: Props) {
  const { brandId } = await params;
  const queryClient = new QueryClient();

  await prefetchBrand(queryClient, brandId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client brandId={brandId} />
    </HydrationBoundary>
  );
}
