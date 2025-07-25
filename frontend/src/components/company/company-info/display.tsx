'use client';

import { useBrand } from '@/services/brand/queries';
import { useCompany } from '@/services/company/queries';

interface Props {
  brandId?: string;
  companyId: string;
}

export default function CompanyInfoDisplay({ brandId, companyId }: Props) {
  const { data: brand } = useBrand(brandId);
  const { data: company } = useCompany(companyId);

  return (
    <div className="text-center">
      <h2 className="text-xl font-black text-primary font-heading">
        Company Information:
      </h2>
      <div className="text-lg">
        {company?.name}
        {brand?.name ? ` (${brand.name})` : null}
      </div>
      <div
        className={`mx-auto mt-4 px-4 py-1 w-fit text-center text-white font-bold rounded ${company?.boycotted ? 'bg-danger' : 'bg-success'}`}>
        {company?.boycotted ? 'Boycotted' : 'Not Boycotted'}
      </div>
    </div>
  );
}
