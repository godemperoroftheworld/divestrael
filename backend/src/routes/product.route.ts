import ProductController from '@/controllers/product.controller';
import PrismaRoute from '@/routes/PrismaRoute';
import { ProductPartialWithRelationsSchema, ProductSchema } from '@/schemas/zod';

export default class ProductRoutes extends PrismaRoute<'Product'> {
  public static readonly instance = new ProductRoutes();

  private constructor() {
    super('product', ProductController.instance, ProductSchema, ProductPartialWithRelationsSchema);
  }
}
