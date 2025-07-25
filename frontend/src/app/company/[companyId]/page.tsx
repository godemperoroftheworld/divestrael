import { use } from 'react';
import CompanyInfo from '@/components/company/company-info';
import { prefetchCompanies, prefetchCompany } from '@/services/company/queries';
import getQueryClient from '@/services/query';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    companyId: string;
  }>;
}

const queryClient = getQueryClient();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId } = await params;
  const company = await prefetchCompany(queryClient, companyId);

  return {
    title: company?.name,
    description: `Should I boycott ${company?.name}?`,
  };
}

export async function generateStaticParams() {
  const companies = await prefetchCompanies(queryClient, { select: ['id'] });
  return companies.map((c) => ({ companyId: c.id }));
}

export default function CompanyPage({ params }: Props) {
  const { companyId } = use(params);

  return <CompanyInfo companyId={companyId} />;
}
