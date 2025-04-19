import { createAllQuery, createOneQuery } from '@/utils/query';
import Product from '@/types/api/product';

const useProducts = createAllQuery(Product, 'product');
const useProduct = createOneQuery(Product, 'product');

export { useProducts, useProduct };
