import { ProductQuery } from '@/resolver/product/product.resolver.types';
import { Provider } from '@/resolver/resolver';
import { Product } from '@/schemas/zod';
import { ERRORS } from '@/helpers/errors.helper';
import BrandResolverPipeline from '@/resolver/brand.resolver';
import ProductService from '@/services/product.service';
import AIService from '@/services/generator.service';

export default class ProductProvider extends Provider<ProductQuery, Product> {
  public override async provide(query: ProductQuery): Promise<Product> {
    let { name } = query;
    const { image } = query;
    let brandName: string | undefined = undefined;
    if (!name && image) {
      const product = await AIService.instance.generateProduct(image);
      name = product.name;
      brandName = product.brand;
    }
    if (!name) {
      throw ERRORS.cannotGenerateProduct;
    }

    const brand = await BrandResolverPipeline.resolve({ product: name, name: brandName });
    return await ProductService.instance.createOne({ name, brandId: brand.id });
  }
}
