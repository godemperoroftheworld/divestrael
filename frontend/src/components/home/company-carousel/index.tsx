import React from 'react';
import { prefetchCompanies } from '@/services/company/queries';
import { FilterOperator } from '@/types/filter';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Client from './client';

export default async function CompanyCarousel() {
  const queryClient = new QueryClient();

  await prefetchCompanies(queryClient, {
    filter: {
      rules: [{ field: 'source', operator: FilterOperator.NOT_NULL }],
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client />
    </HydrationBoundary>
  );
}
