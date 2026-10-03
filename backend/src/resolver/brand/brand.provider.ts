import { BrandQuery } from '@/resolver/brand/brand.resolver.types';
import { Provider } from '@/resolver/resolver';
import { Brand } from '@/schemas/zod';
import BrandService from '@/services/brand.service';
import { ERRORS, isUniqueViolation } from '@/helpers/errors.helper';
import CompanyResolverPipeline from '@/resolver/company.resolver';
import AIService from '@/services/generator.service';

export default class BrandProvider extends Provider<BrandQuery, Brand> {
  public override async provide(query: BrandQuery): Promise<Brand> {
    let { name } = query;
    const { product } = query;
    if (!name && product) {
      name = await AIService.instance.generateBrand(product);
    }
    name = name?.trim();
    if (!name) {
      throw ERRORS.cannotGenerateBrand;
    }
    const company = await CompanyResolverPipeline.resolve({ brand: name, product });
    try {
      return await BrandService.instance.createOne({ name, companyId: company.id });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      // Lost a race against a concurrent request.
      const raced = await BrandService.instance.getOneByProperty('name', name);
      if (raced) return raced;
      throw ERRORS.brandExists;
    }
  }
}
