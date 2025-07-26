import { useSearchCompanies } from '@/services/company/queries';
import { useSearchBrands } from '@/services/brand/queries';
import { useSearchProducts } from '@/services/product/queries';
import { useMemo } from 'react';

export default function useGlobalSearch(query: string) {
  const { data: companies } = useSearchCompanies(
    query,
    { take: 5 },
    {
      placeholderData: (prev) => prev,
    },
  );
  const { data: brands } = useSearchBrands(
    query,
    { take: 5 },
    {
      placeholderData: (prev) => prev,
    },
  );
  const { data: products } = useSearchProducts(
    query,
    { take: 5 },
    {
      placeholderData: (prev) => prev,
    },
  );

  return useMemo(
    () => ({
      companies: companies ?? [],
      brands: brands ?? [],
      products: products ?? [],
    }),
    [companies, brands, products],
  );
}
