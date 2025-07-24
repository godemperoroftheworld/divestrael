'use client';

import { useSearchCompanies } from '@/services/company/queries';
import { useMemo, useState, useCallback } from 'react';
import { useSearchBrands } from '@/services/brand/queries';
import { useSearchProducts } from '@/services/product/queries';
import dynamic from 'next/dynamic';
import Brand from '@/types/api/brand';
import Company from '@/types/api/company';
import Product from '@/types/api/product';
import { GetOptionLabel } from 'react-select';
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data } = useSearchCompanies(searchQuery, { take: 5 });
  const { data: brandData } = useSearchBrands(searchQuery, { take: 5 });
  const { data: productData } = useSearchProducts(searchQuery, { take: 5 });

  const filterOption = useCallback(() => true, []);
  const getOptionLabel: GetOptionLabel<Brand | Company | Product> = useCallback(
    (option) => option.name,
    [],
  );
  const searchOptions = useMemo(
    () => [
      {
        label: 'Products',
        options: productData ?? [],
      },
      {
        label: 'Brands',
        options: brandData ?? [],
      },
      {
        label: 'Companies',
        options: data ?? [],
      },
    ],
    [data, brandData, productData],
  );

  return (
    <Select
      id="select"
      options={typeof window !== undefined ? searchOptions : []}
      getOptionLabel={getOptionLabel as GetOptionLabel<unknown>}
      inputValue={searchQuery}
      filterOption={filterOption}
      onInputChange={setSearchQuery}
      placeholder="Search for a product, a brand, or a company."
      maxMenuHeight={5000}
    />
  );
}
