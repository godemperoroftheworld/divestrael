import { prefetchProduct, prefetchProducts } from '@/services/product/queries';
import getQueryClient from '@/services/query';
import CompanyInfo from '../../../../components/company/info';
import Hydrater from '@/components/hydrater';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const queryClient = getQueryClient();

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = await prefetchProduct(queryClient, productId, {
    select: ['name'],
  });

  return {
    title: product?.name,
    description: `Should I boycott ${product?.name}?`,
  };
}

export async function generateStaticParams() {
  const products = await prefetchProducts(queryClient, { select: ['id'] });
  return products.map((p) => ({ productId: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await prefetchProduct(queryClient, productId, {
    include: ['brand'],
    select: ['brandId', 'brand.companyId'],
  });

  if (!product?.brand) {
    return null;
  }
  return (
    <Hydrater queryClient={queryClient}>
      <CompanyInfo
        companyId={product.brand.companyId}
        brandId={product.brandId}
      />
    </Hydrater>
  );
}
