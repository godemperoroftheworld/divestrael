'use client';

import Carousel from '@/components/ui/carousel';
import ConditionalLink from '@/components/ui/conditional-link';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';
import { FilterOperator } from '@/types/filter';

export default function CompanyCarousel() {
  const { data } = useCompanies({
    filter: {
      rules: [{ field: 'source', operator: FilterOperator.NOT_NULL }],
    },
  });

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);

  return (
    <Carousel
      className="mx-auto overflow-hidden"
      options={{ loop: true, align: 'start' }}
      scroll={{ playOnInit: true, speed: 1 }}>
      {companyLogos.map((company) => (
        <div
          key={company.id}
          className="rounded-lg overflow-hidden">
          <ConditionalLink href={`/company/${company.id}`}>
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
