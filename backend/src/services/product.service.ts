import BrandService from '@/services/brand.service';
import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

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

    const brand = await BrandService.instance.getOrCreateByName(brandName, name);
    return this.createOne({ name, brandId: brand.id }, { include: ['brand.company'] });
  }
}
