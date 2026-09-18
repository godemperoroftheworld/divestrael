import { ProductQuery, ProductResolver } from '@/resolver/product/product.resolver.types';
import { Product } from '@/schemas/zod';
import ProductService from '@/services/product.service';

export default class IdProductResolver extends ProductResolver {
  public override async resolve({ id }: ProductQuery): Promise<Product | null> {
    if (id) {
      return await ProductService.instance.getOne(id);
    }
    return null;
  }
}
