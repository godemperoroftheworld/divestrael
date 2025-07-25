'use client';

import { useProduct } from '@/services/product/queries';
import CompanyInfo from '@/components/company/company-info';

interface Props {
  productId: string;
}

export default function ProductPage({ productId }: Props) {
  const { data: product } = useProduct(productId, { include: ['brand'] });

  return (
    <>
      {product?.brand ? (
        <CompanyInfo
          companyId={product?.brand?.companyId}
          brandId={product?.brandId}
        />
      ) : null}
    </>
  );
}
