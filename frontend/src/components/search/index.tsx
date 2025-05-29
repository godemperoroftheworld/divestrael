'use client';

import { useSearchCompanies } from '@/services/company/queries';
import { useMemo, useState } from 'react';
import { useSearchBrands } from '@/services/brand/queries';
import { useSearchProducts } from '@/services/product/queries';
import Select from 'react-select';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data } = useSearchCompanies(searchQuery, { take: 5 });
  const { data: brandData } = useSearchBrands(searchQuery, { take: 5 });
  const { data: productData } = useSearchProducts(searchQuery, { take: 5 });

  const searchOptions = useMemo(
    () => [
      {
        label: 'Companies',
        options: data ?? [],
      },
      {
        label: 'Brands',
        options: brandData ?? [],
      },
      {
        label: 'Products',
        options: productData ?? [],
      },
    ],
    [data, brandData, productData],
  );

  const formatGroupLabel = (data: { label: string; options: unknown[] }) => (
    <div className="flex align-center justify-between">
      <span>{data.label}</span>
      <span>{data.options.length}</span>
    </div>
  );

  return (
    <Select
      options={searchOptions}
      formatGroupLabel={formatGroupLabel}
      getOptionLabel={(option) => option.name}
      value={searchQuery}
      onInputChange={setSearchQuery}
    />
  );
}
