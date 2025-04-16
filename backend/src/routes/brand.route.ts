import BrandController from '@/controllers/brand.controller';
import PrismaRoute from '@/routes/PrismaRoute';
import { BrandPartialWithRelationsSchema, BrandSchema } from '@/schemas/zod';

export default class BrandRoute extends PrismaRoute<'Brand'> {
  public static readonly instance = new BrandRoute();

  private constructor() {
    super('brand', BrandController.instance, BrandSchema, BrandPartialWithRelationsSchema);
  }
}
