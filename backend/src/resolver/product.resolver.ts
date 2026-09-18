import { ResolverPipeline } from '@/resolver/resolver';
import { Product } from '@/schemas/zod';
import IdProductResolver from '@/resolver/product/id.product.resolver';
import NameProductResolver from '@/resolver/product/name.product.resolver';
import ProductProvider from '@/resolver/product/product.provider';
import { ProductQuery } from '@/resolver/product/product.resolver.types';

export { ProductQuery, ProductResolver } from '@/resolver/product/product.resolver.types';

export default class ProductPipeline extends ResolverPipeline<ProductQuery, Product> {
  private static readonly instance = new ProductPipeline();

  public static async resolve(query: ProductQuery): Promise<Product> {
    return this.instance.resolve(query);
  }

  private constructor() {
    super([new IdProductResolver(), new NameProductResolver()], new ProductProvider());
  }
}
