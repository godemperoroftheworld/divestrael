import { Product } from '@prisma/client';

import BrandService, { BrandWithCompany } from '@/services/brand.service';
import PrismaService from '@/services/PrismaService';

export interface ProductWithBrand extends Product {
  brand: BrandWithCompany;
}

// Service to get barcode information
export default class ProductService extends PrismaService<'Product', 'product', ProductWithBrand> {
  public static readonly instance = new ProductService();

  protected override lookup() {
    return {
      from: 'brands',
      localField: 'brandId',
      foreignField: '_id',
      as: 'brand',
    };
  }

  protected override baseIncludes() {
    return { brand: { include: { company: true } } };
  }

  protected override searchPaths(): string[] {
    return ['name'];
  }

  protected override fields(): (keyof ProductWithBrand)[] {
    return ['name', 'brand'];
  }

  private constructor() {
    super('product');
  }

  public async getOrCreateByName(name: string, brandName: string): Promise<ProductWithBrand> {
    const result = await super.searchOne(name, true);
    if (result) {
      return result;
    }

    const brand = await BrandService.instance.getOrCreateByName(brandName);
    return this.createOne({ name, brandId: brand.id });
  }
}
