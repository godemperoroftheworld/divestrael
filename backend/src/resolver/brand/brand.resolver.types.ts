import { Resolver } from '@/resolver/resolver';
import { Brand } from '@/schemas/zod';

export interface BrandQuery {
  id?: string;
  name?: string;
  product?: string;
}

export abstract class BrandResolver extends Resolver<BrandQuery, Brand> {}
