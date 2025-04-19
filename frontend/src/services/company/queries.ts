import { createQuery } from '@/utils/query';
import Brand from '@/types/api/brand';

const useBrands = createQuery(Brand, 'brand');

export { useBrands };
