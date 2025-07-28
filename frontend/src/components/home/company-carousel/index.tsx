import React from 'react';
import { prefetchCompanies } from '@/services/company/queries';
import { FilterOperator } from '@/types/filter';
import getQueryClient from '@/services/query';
import Carousel from '@/components/ui/carousel';
import ConditionalLink from '@/components/ui/conditional-link';
import Image from 'next/image';

const queryClient = getQueryClient();

export default async function CompanyCarousel() {
  const companies = await prefetchCompanies(queryClient, {
    filter: {
      rules: [{ field: 'source', operator: FilterOperator.NOT_NULL }],
    },
  });

  const companyLogos = companies.filter((x) => !!x.url) ?? [];

  return (
    <Carousel
      className="mx-auto overflow-hidden"
      options={{ loop: true, align: 'start', skipSnaps: true }}
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
