import { prefetchCompany } from '@/services/company/queries';
import { prefetchBrand } from '@/services/brand/queries';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';
import Content from './content';

interface Props {
  brandId?: string;
  companyId: string;
}

const queryClient = getQueryClient();

export default async function CompanyInfo({ companyId, brandId }: Props) {
  const company = await prefetchCompany(queryClient, companyId, {
    include: ['brands'],
  });
  const brand = brandId ? await prefetchBrand(queryClient, brandId) : undefined;

  return (
    <Hydrater queryClient={queryClient}>
      <Content
        company={company}
        brand={brand}
      />
    </Hydrater>
  );
}
