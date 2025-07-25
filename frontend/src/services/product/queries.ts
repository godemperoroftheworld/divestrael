import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Product from '@/types/api/product';

const { prefetchQuery: prefetchProducts, useQuery: useProducts } =
  createAllQuery(Product, 'product');
const { useQuery: useSearchProducts } = createSearchQuery(Product, 'product');
const { prefetchQuery: prefetchProduct, useQuery: useProduct } = createOneQuery(
  Product,
  'product',
);

export {
  useProduct,
  prefetchProduct,
  useProducts,
  prefetchProducts,
  useSearchProducts,
};
