'use client';

import { useSearchCompanies } from '@/services/company/queries';
import { useMemo, useState, useCallback, HTMLAttributes } from 'react';
import { useSearchBrands } from '@/services/brand/queries';
import { useSearchProducts } from '@/services/product/queries';
import dynamic from 'next/dynamic';
import Brand from '@/types/api/brand';
import Company from '@/types/api/company';
import Product from '@/types/api/product';
import { GetOptionLabel } from 'react-select';
import { useRouter } from 'next/navigation';
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function Search(props: HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

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

  const onChange = useCallback(
    (value: Brand | Company | Product) => {
      if ('brandId' in value) {
        // Product
        router.push(`/product/${value.id}`);
      } else if ('companyId' in value) {
        // Brand
        router.push(`/brand/${value.id}`);
      } else {
        // Company
        router.push(`/company/${value.id}`);
      }
    },
    [router],
  );

  return (
    <Select
      {...props}
      id="select"
      options={typeof window !== undefined ? searchOptions : []}
      getOptionLabel={getOptionLabel as GetOptionLabel<unknown>}
      inputValue={searchQuery}
      filterOption={filterOption}
      onInputChange={setSearchQuery}
      placeholder="Search for a product, a brand, or a company."
      maxMenuHeight={5000}
      onChange={onChange as (option: unknown) => void}
    />
  );
}
