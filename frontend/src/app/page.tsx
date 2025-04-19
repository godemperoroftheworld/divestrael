'use client';
import { useBrands } from '@/services/brand/queries';
import { FilterOperator } from '@/types/filter';

export default function Home() {
  const { data } = useBrands({
    filter: {
      condition: 'AND',
      not: false,
      rules: [
        {
          field: 'name',
          operator: FilterOperator.CONTAINS,
          value: 'lar',
        },
      ],
    },
  });

  return <div>{JSON.stringify(data)}</div>;
}
