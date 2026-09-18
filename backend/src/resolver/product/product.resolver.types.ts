import { Resolver } from '@/resolver/resolver';
import { Product } from '@/schemas/zod';

export interface ProductQuery {
  id?: string;
  name?: string;
  image?: string;
}

export abstract class ProductResolver extends Resolver<ProductQuery, Product> {}
