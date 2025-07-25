'use client';

import { use } from 'react';
import { useProduct } from '@/services/product/queries';
import CompanyInfo from '@/components/company/company-info';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

export default function ProductPage({ params }: Props) {
  const { productId } = use(params);
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
