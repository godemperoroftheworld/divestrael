'use client';

import { useMemo, useState, useCallback, HTMLAttributes } from 'react';
import Brand from '@/types/api/brand';
import Company from '@/types/api/company';
import Product from '@/types/api/product';
import { GetOptionLabel } from 'react-select';
import { useRouter } from 'next/navigation';
import useGlobalSearch from '@/components/home/search/hook';
import { mergeClasses } from '@/utils/class';
import Select from '@/components/ui/select';

export default function Search({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const { products, brands, companies } = useGlobalSearch(searchQuery);

  const filterOption = useCallback(() => true, []);
  const getOptionLabel: GetOptionLabel<Brand | Company | Product> = useCallback(
    (option) => option.name,
    [],
  );
  const searchOptions = useMemo(
    () => [
      {
        label: 'Products',
        options: products,
      },
      {
        label: 'Brands',
        options: brands,
      },
      {
        label: 'Companies',
        options: companies,
      },
    ],
    [products, brands, companies],
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
      {...rest}
      className={mergeClasses(className, 'max-w-full min-w-0 shrink')}
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
