import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Product from '@/types/api/product';

const useProducts = createAllQuery(Product, 'product');
const useSearchProducts = createSearchQuery(Product, 'product');
const useProduct = createOneQuery(Product, 'product');

export { useProducts, useSearchProducts, useProduct };
