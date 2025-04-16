import { Product } from '@prisma/client';

import BrandService, { BrandWithCompany } from '@/services/brand.service';
import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

export interface ProductWithBrand extends Product {
  brand: BrandWithCompany;
}

// Service to get barcode information
export default class ProductService extends PrismaService<'Product'> {
  public static readonly instance = new ProductService();

  protected override searchPaths(): string[] {
    return ['name'];
  }

  private constructor() {
    super('product');
  }

  public async getOrCreateByName(
    name: string,
    brandName: string,
  ): Promise<PrismaModelExpanded<'Product'>> {
    const result = await super.searchOne(name, true);
    if (result) {
      return result;
    }

    const brand = await BrandService.instance.getOrCreateByName(brandName, name);
    return this.createOne({ name, brandId: brand.id });
  }
}
