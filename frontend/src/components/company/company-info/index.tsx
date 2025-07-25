import { prefetchCompany } from '@/services/company/queries';
import { prefetchBrand } from '@/services/brand/queries';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Client from './client';

interface Props {
  brandId?: string;
  companyId: string;
}

export default async function CompanyInfo({ companyId, brandId }: Props) {
  const queryClient = new QueryClient();

  await Promise.all([
    prefetchBrand(queryClient, brandId),
    prefetchCompany(queryClient, companyId),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client
        companyId={companyId}
        brandId={brandId}
      />
    </HydrationBoundary>
  );
}
