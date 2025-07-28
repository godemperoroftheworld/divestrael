import CompanyBrands from '../brands';
import Brand from '@/types/api/brand';
import Company from '@/types/api/company';
import ConditionalLink from '@/components/ui/conditional-link';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  brand?: Brand;
  company: Company;
}

export default function CompanyInfoContent({ brand, company }: Props) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-black text-primary font-heading">
          Company Information:
        </h2>
        <div className="text-lg">
          {company.name}
          {brand?.name ? ` (${brand.name})` : null}
        </div>
        <div
          className={`mx-auto mt-4 px-4 py-1 w-fit text-center text-white font-bold rounded ${company.boycotted ? 'bg-danger' : 'bg-success'}`}>
          {company.boycotted ? 'Boycotted' : 'Not Boycotted'}
        </div>
      </div>
      <div className="w-full">
        <ConditionalLink
          href={company.url}
          className="block w-fit mx-auto"
          target="_blank">
          {company.image_url ? (
            <Image
              priority={true}
              className="w-48 mx-auto rounded overflow-hidden"
              src={company.image_url}
              alt="Logo"
              width={100}
              height={100}
            />
          ) : null}
        </ConditionalLink>
        {!brand ? (
          <CompanyBrands
            className="py-2 w-fit"
            brands={company.brands ?? []}
          />
        ) : null}
      </div>
      <p className="text-center mx-auto max-w-2xl">{company.description}</p>
      {company.boycotted ? (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {company.reasonsFormatted?.map((reason, idx) => (
              <div
                key={idx}
                className="px-4 py-1 min-w-64 text-center text-white font-bold rounded bg-danger">
                {reason}
              </div>
            ))}
          </div>
          <Link
            className="italic font-medium underline text-secondary"
            href={company.source!}
            target="_blank">
            {company.source}
          </Link>
        </>
      ) : null}
    </>
  );
}
