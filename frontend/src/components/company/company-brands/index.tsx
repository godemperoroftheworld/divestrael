import { prefetchBrands } from '@/services/brand/queries';
import { FilterOperator } from '@/types/filter';
import React, { HTMLAttributes } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Client from './client';

interface Props extends HTMLAttributes<HTMLDivElement> {
  companyId: string;
}

export default async function BrandCarousel({ companyId, ...rest }: Props) {
  const queryClient = new QueryClient();

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client
        companyId={companyId}
        {...rest}
      />
    </HydrationBoundary>
  );
}
