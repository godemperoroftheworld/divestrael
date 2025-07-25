import { use } from 'react';
import CompanyInfo from '@/components/company/company-info';

interface Props {
  params: Promise<{
    companyId: string;
  }>;
}

export default function CompanyPage({ params }: Props) {
  const { companyId } = use(params);

  return <CompanyInfo companyId={companyId} />;
}
