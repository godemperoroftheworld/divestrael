import { createPostMutation } from '@/utils/mutate';
import Product from '@/types/api/product';

const usePostProduct = createPostMutation(Product, 'allinclusive/product');

export { usePostProduct };
