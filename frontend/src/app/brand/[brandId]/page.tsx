'use client';

import { useBrand } from '@/services/brand/queries';
import { use } from 'react';
import CompanyInfo from '@/components/company/company-info';

interface Props {
  params: Promise<{
    brandId: string;
  }>;
}

export default function BrandPage({ params }: Props) {
  const { brandId } = use(params);
  const { data: brand } = useBrand(brandId);

  return (
    <>
      {brand?.companyId ? (
        <CompanyInfo
          brandId={brandId}
          companyId={brand?.companyId}
        />
      ) : null}
    </>
  );
}
