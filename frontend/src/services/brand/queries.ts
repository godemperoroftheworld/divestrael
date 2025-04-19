import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Brand from '@/types/api/brand';

const useBrands = createAllQuery(Brand, 'brand');
const useSearchBrands = createSearchQuery(Brand, 'brand');
const useBrand = createOneQuery(Brand, 'brand');

export { useBrands, useSearchBrands, useBrand };
