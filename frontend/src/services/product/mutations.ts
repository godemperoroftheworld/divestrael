import { createPostMutation } from '@/utils/mutate';
import Product from '@/types/api/product';

const usePostProduct = createPostMutation<Product, { image: string }>(
  Product,
  'allinclusive/product',
);

export { usePostProduct };
