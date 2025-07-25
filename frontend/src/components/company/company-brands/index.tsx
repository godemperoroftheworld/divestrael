import { prefetchBrands } from '@/services/brand/queries';
import { FilterOperator } from '@/types/filter';
import React, { HTMLAttributes } from 'react';
import Client from './client';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';

interface Props extends HTMLAttributes<HTMLDivElement> {
  companyId: string;
}

const queryClient = getQueryClient();

export default async function BrandCarousel({ companyId, ...rest }: Props) {
  await prefetchBrands(queryClient, {
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
    <Hydrater queryClient={queryClient}>
      <Client
        companyId={companyId}
        {...rest}
      />
    </Hydrater>
  );
}
