import { createAllQuery, createOneQuery } from '@/utils/query';
import Brand from '@/types/api/brand';

const useBrands = createAllQuery(Brand, 'brand');
const useBrand = createOneQuery(Brand, 'brand');

export { useBrands, useBrand };
