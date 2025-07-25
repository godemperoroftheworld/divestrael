import { prefetchCompany } from '@/services/company/queries';
import { prefetchBrand } from '@/services/brand/queries';
import CompanyBrands from '@/components/company/company-brands';
import getQueryClient from '@/services/query';
import CompanyInfoDisplay from '@/components/company/company-info/display';
import CompanyPicture from '@/components/company/company-info/picture';
import CompanyDetails from '@/components/company/company-info/details';
import Hydrater from '@/components/hydrater';

interface Props {
  brandId?: string;
  companyId: string;
}

const queryClient = getQueryClient();

export default async function CompanyInfo({ companyId, brandId }: Props) {
  await Promise.all([
    prefetchBrand(queryClient, brandId),
    prefetchCompany(queryClient, companyId),
  ]);

  return (
    <Hydrater queryClient={queryClient}>
      <CompanyInfoDisplay
        brandId={brandId}
        companyId={companyId}
      />
      <div className="w-full">
        <CompanyPicture companyId={companyId} />
        {!brandId ? (
          <CompanyBrands
            className="py-2 w-fit"
            companyId={companyId}
          />
        ) : null}
      </div>
      <CompanyDetails companyId={companyId} />
    </Hydrater>
  );
}
