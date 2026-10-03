import { ProductQuery, ProductResolver } from '@/resolver/product/product.resolver.types';
import { Product } from '@/schemas/zod';
import ProductService from '@/services/product.service';

export default class NameProductResolver extends ProductResolver {
  public override async resolve({ name }: ProductQuery): Promise<Product | null> {
    if (name) {
      return await ProductService.instance.getOneByProperty('name', name, {
        include: ['brand.company'],
      });
    }
    return null;
  }
}
