import { ProductQuery } from '@/resolver/product/product.resolver.types';
import { Product } from '@/schemas/zod';
import ProductService from '@/services/product.service';
import { Provider } from '@/resolver/resolver';
import { ERRORS } from '@/helpers/errors.helper';
import AIService from '@/services/generator.service';

export default class ProductProvider extends Provider<ProductQuery, Product> {
  public override async provide(query: ProductQuery): Promise<Product> {
    let { name, brand } = query;
    const { image } = query;
    if (!name && image) {
      const generated = await AIService.instance.generateProduct(image);
      name = generated.name;
      brand = brand || generated.brand;
    }
    name = name?.trim();
    brand = brand?.trim();
    if (!name) {
      throw ERRORS.cannotGenerateProduct;
    }

    return await ProductService.instance.getOrCreateByName(name, brand ?? '');
  }
}
