'use client';

import ConditionalLink from '@/components/ui/conditional-link';
import Image from 'next/image';
import { useCompany } from '@/services/company/queries';

interface Props {
  companyId: string;
}

export default function CompanyPicture({ companyId }: Props) {
  const { data: company } = useCompany(companyId);

  return (
    <ConditionalLink
      href={company?.url}
      className="block w-fit mx-auto"
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
  );
}
