import { prefetchProduct } from '@/services/product/queries';
import getQueryClient from '@/services/query';
import CompanyInfo from '@/components/company/company-info';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const queryClient = getQueryClient();

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await prefetchProduct(queryClient, productId, {
    include: ['brand'],
  });

  if (!product?.brand) {
    return null;
  }
  return (
    <CompanyInfo
      companyId={product.brand.companyId}
      brandId={product.brandId}
    />
  );
}
