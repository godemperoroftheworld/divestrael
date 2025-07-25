'use client';

import Link from 'next/link';
import { useCompany } from '@/services/company/queries';

interface Props {
  companyId: string;
}

export default function CompanyDetails({ companyId }: Props) {
  const { data: company } = useCompany(companyId);
  console.log(JSON.stringify(company));

  return (
    <>
      <p className="mt-4 text-center mx-auto max-w-2xl">
        {company?.description}
      </p>
      {company?.boycotted ? (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {company?.reasonsFormatted?.map((reason, idx) => (
              <div
                key={idx}
                className="px-4 py-1 min-w-64 text-center text-white font-bold rounded bg-danger">
                {reason}
              </div>
            ))}
          </div>
          <Link
            className="italic underline text-secondary"
            href={company.source!}
            target="_blank">
            {company.source}
          </Link>
        </>
      ) : null}
    </>
  );
}
