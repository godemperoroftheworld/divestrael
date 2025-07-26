import { use } from 'react';
import CompanyInfo from '@/components/company/company-info';
import { prefetchCompanies } from '@/services/company/queries';
import getQueryClient from '@/services/query';

interface Props {
  params: Promise<{
    companyId: string;
  }>;
}

export async function generateStaticParams() {
  const queryClient = getQueryClient();
  const companies = await prefetchCompanies(queryClient, { select: ['id'] });
  return companies.map((c) => ({ companyId: c.id }));
}

export default function CompanyPage({ params }: Props) {
  const { companyId } = use(params);

  return <CompanyInfo companyId={companyId} />;
}
