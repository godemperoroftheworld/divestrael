import BrandController from '@/controllers/brand.controller';
import { brandBody, brandResponse } from '@/schemas/brand.schema';
import PrismaRoute from '@/routes/PrismaRoute';
import { BrandWithCompany } from '@/services/brand.service';

export default class BrandRoute extends PrismaRoute<'Brand', BrandWithCompany> {
  public static readonly instance = new BrandRoute();

  private constructor() {
    super('brand', BrandController.instance, brandBody, brandResponse);
  }
}
