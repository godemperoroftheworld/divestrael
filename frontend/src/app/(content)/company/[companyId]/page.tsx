import CompanyInfo from '../../../../components/company/info';
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
  const company = await prefetchCompany(queryClient, companyId, {
    select: ['name'],
  });

  return {
    title: company?.name,
    description: `Should I boycott ${company?.name}?`,
  };
}

export async function generateStaticParams() {
  const companies = await prefetchCompanies(queryClient, { select: ['id'] });
  return companies.map((c) => ({ companyId: c.id }));
}

export default async function CompanyPage({ params }: Props) {
  const { companyId } = await params;

  return <CompanyInfo companyId={companyId} />;
}
