import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import BrandResolverPipeline from '@/resolver/brand.resolver';

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
    const result = await super.searchOne(name, true, {
      include: ['brand.company'],
    });
    if (result) {
      return result;
    }

    const brand = await BrandResolverPipeline.resolve({ name: brandName, product: name });
    return this.createOne({ name, brandId: brand.id }, { include: ['brand.company'] });
  }
}
