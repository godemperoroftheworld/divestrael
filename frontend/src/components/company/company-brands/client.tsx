import { useBrands } from '@/services/brand/queries';
import { FilterOperator } from '@/types/filter';
import Carousel from '@/components/ui/carousel';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  companyId: string;
}

export default function BrandCarousel({
  companyId,
  className,
  ...rest
}: Props) {
  const { data: brands } = useBrands({
    filter: {
      rules: [
        {
          operator: FilterOperator.EQUALS,
          field: 'companyId',
          value: companyId,
        },
      ],
    },
  });

  return (
    <Carousel
      autoScroll={true}
      className={`${className ?? ''} mx-auto overflow-hidden`}
      {...rest}>
      {brands?.map((brand) => (
        <div
          className="text-secondary font-medium italic"
          key={brand.id}>
          {brand.name}
        </div>
      )) ?? []}
    </Carousel>
  );
}
