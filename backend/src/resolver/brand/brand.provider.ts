import { BrandQuery } from '@/resolver/brand/brand.resolver.types';
import { Provider } from '@/resolver/resolver';
import { Brand } from '@/schemas/zod';
import BrandService from '@/services/brand.service';
import { ERRORS } from '@/helpers/errors.helper';
import CompanyResolverPipeline from '@/resolver/company.resolver';
import AIService from '@/services/generator.service';

export default class BrandProvider extends Provider<BrandQuery, Brand> {
  public override async provide(query: BrandQuery): Promise<Brand> {
    let { name } = query;
    const { product } = query;
    if (!name && product) {
      name = await AIService.instance.generateBrand(product);
    }
    if (!name) {
      throw ERRORS.cannotGenerateBrand;
    }
    const company = await CompanyResolverPipeline.resolve({ brand: name, product });
    return await BrandService.instance.createOne({ name, companyId: company.id });
  }
}
