import { prefetchProduct } from '@/services/product/queries';
import Client from './client';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const queryClient = getQueryClient();

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  await prefetchProduct(queryClient, productId, { include: ['brand'] });

  return (
    <Hydrater queryClient={queryClient}>
      <Client productId={productId} />
    </Hydrater>
  );
}
