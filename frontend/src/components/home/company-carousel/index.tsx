import React from 'react';
import { prefetchCompanies } from '@/services/company/queries';
import { FilterOperator } from '@/types/filter';
import Client from './client';
import getQueryClient from '@/services/query';
import Hydrater from '@/components/hydrater';

const queryClient = getQueryClient();

export default async function CompanyCarousel() {
  await prefetchCompanies(queryClient, {
    filter: {
      rules: [{ field: 'source', operator: FilterOperator.NOT_NULL }],
    },
  });

  return (
    <Hydrater queryClient={queryClient}>
      <Client />
    </Hydrater>
  );
}
