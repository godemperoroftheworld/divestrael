import { ResolverPipeline } from '@/resolver/resolver';
import { Brand } from '@/schemas/zod';
import IdBrandResolver from '@/resolver/brand/id.brand.resolver';
import NameBrandResolver from '@/resolver/brand/name.brand.resolver';
import BrandProvider from '@/resolver/brand/brand.provider';
import { BrandQuery } from '@/resolver/brand/brand.resolver.types';

export { BrandQuery, BrandResolver } from '@/resolver/brand/brand.resolver.types';

export default class BrandResolverPipeline extends ResolverPipeline<BrandQuery, Brand> {
  private static readonly instance = new BrandResolverPipeline();

  public static async resolve(query: BrandQuery): Promise<Brand> {
    return this.instance.resolve(query);
  }

  private constructor() {
    super([new IdBrandResolver(), new NameBrandResolver()], new BrandProvider());
  }
}
