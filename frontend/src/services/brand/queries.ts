import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Brand from '@/types/api/brand';

const { prefetchQuery: prefetchBrands, useQuery: useBrands } = createAllQuery(
  Brand,
  'brand',
);
const { useQuery: useSearchBrands } = createSearchQuery(Brand, 'brand');
const { prefetchQuery: prefetchBrand, useQuery: useBrand } = createOneQuery(
  Brand,
  'brand',
);

export { useBrands, prefetchBrands, useSearchBrands, useBrand, prefetchBrand };
