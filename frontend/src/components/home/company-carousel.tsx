'use client';

import Carousel from '@/components/ui/carousel';
import ConditionalLink from '@/components/ui/conditional-link';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';

export default function CompanyCarousel() {
  const { data } = useCompanies();

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);

  return (
    <Carousel className="mx-auto overflow-hidden">
      {companyLogos.map((company) => (
        <div
          key={company.id}
          className="rounded-lg overflow-hidden">
          <ConditionalLink
            href={company.url}
            target="_blank">
            <Image
              className="w-32 aspect-square"
              title={company.name}
              src={company.image_url}
              alt={company.name}
              width={100}
              height={100}
            />
          </ConditionalLink>
        </div>
      ))}
    </Carousel>
  );
}
