import React, { HTMLAttributes } from 'react';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';
import Carousel from '@/components/ui/carousel';
import { mergeClasses } from '@/utils/class';
import Brand from '@/types/api/brand';

interface Props extends HTMLAttributes<HTMLDivElement> {
  brands: Brand[];
}

const queryClient = getQueryClient();

export default function BrandCarousel({ brands, className, ...rest }: Props) {
  return (
    <Hydrater queryClient={queryClient}>
      <Carousel
        options={{ loop: true, watchDrag: false, align: 'center' }}
        scroll={{ playOnInit: true, speed: 0.5, stopOnInteraction: false }}
        className={mergeClasses(className, 'mx-auto overflow-hidden')}
        {...rest}>
        {brands?.map((brand) => (
          <div
            className="text-secondary font-medium italic"
            key={brand.id}>
            {brand.name}
          </div>
        )) ?? []}
      </Carousel>
    </Hydrater>
  );
}
