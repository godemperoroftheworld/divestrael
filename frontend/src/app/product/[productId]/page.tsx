import { prefetchProduct } from '@/services/product/queries';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Client from './client';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const queryClient = new QueryClient();
  await prefetchProduct(queryClient, productId, { include: ['brand'] });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client productId={productId} />
    </HydrationBoundary>
  );
}
