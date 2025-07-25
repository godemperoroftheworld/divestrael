'use client';

import Image from 'next/image';
import { useCompany } from '@/services/company/queries';
import { useBrand } from '@/services/brand/queries';
import ConditionalLink from '@/components/ui/conditional-link';
import CompanyBrands from '../company-brands';
import Link from 'next/link';

interface Props {
  brandId?: string;
  companyId: string;
}

export default function CompanyInfo({ companyId, brandId }: Props) {
  const { data: brand } = useBrand(brandId);
  const { data: company } = useCompany(companyId);

  return (
    <>
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
      <div className="w-full">
        <ConditionalLink
          href={company?.url}
          target="_blank">
          {company?.image_url ? (
            <Image
              priority={true}
              className="w-48 mx-auto rounded overflow-hidden"
              src={company?.image_url}
              alt="Logo"
              width={100}
              height={100}
            />
          ) : null}
        </ConditionalLink>
        {!brandId ? (
          <CompanyBrands
            className="py-2"
            companyId={companyId}
          />
        ) : null}
        <p className="mt-4 text-center mx-auto max-w-2xl">
          {company?.description}
        </p>
      </div>
      {company?.boycotted ? (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {company?.reasons?.map((reason, idx) => (
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
