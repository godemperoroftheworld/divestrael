import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import BrandResolverPipeline from '@/resolver/brand.resolver';
import { ERRORS, isUniqueViolation } from '@/helpers/errors.helper';

const WITH_COMPANY = { include: ['brand.company'] };

// Service to get barcode information
export default class ProductService extends PrismaService<'Product'> {
  public static readonly instance = new ProductService();

  protected override searchPath(): string {
    return 'name';
  }

  private constructor() {
    super('product');
  }

  public async getOrCreateByName(
    name: string,
    brandName: string,
  ): Promise<PrismaModelExpanded<'Product'>> {
    const existing = await this.getOneByProperty('name', name, WITH_COMPANY);
    if (existing) {
      return existing;
    }

    const brand = await BrandResolverPipeline.resolve({ name: brandName, product: name });
    try {
      return await this.createOne({ name, brandId: brand.id }, WITH_COMPANY);
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      // Lost a race against a concurrent request; the row we wanted now exists.
      const raced = await this.getOneByProperty('name', name, WITH_COMPANY);
      if (raced) return raced;
      throw ERRORS.productExists;
    }
  }
}
