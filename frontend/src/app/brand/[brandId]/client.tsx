'use client';

import { useBrand } from '@/services/brand/queries';
import CompanyInfo from '../../../components/company/info';

interface Props {
  brandId: string;
}

export default function BrandPage({ brandId }: Props) {
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
