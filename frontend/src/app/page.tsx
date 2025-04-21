'use client';

import { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';
import { FilterOperator } from '@/types/filter';
import Image from 'next/image';
import Carousel from '@/components/carousel';

export default function Home() {
  const { data } = useCompanies({
    take: 10,
    filter: {
      rules: [
        {
          field: 'url',
          operator: FilterOperator.NOT_NULL,
        },
      ],
    },
  });

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);

  return (
    <div className="mx-auto overflow-hidden">
      <Carousel>
        {companyLogos.map((company) => (
          <div
            key={company.id}
            className="rounded-lg overflow-hidden">
            <Image
              className="w-32 aspect-square"
              src={company.image_url}
              alt={company.name}
              width={100}
              height={100}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
