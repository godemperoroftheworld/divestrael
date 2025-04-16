import { productBody, productResponse } from '@/schemas/product.schema';
import ProductController from '@/controllers/product.controller';
import PrismaRoute from '@/routes/PrismaRoute';

export default class ProductRoutes extends PrismaRoute<'Product'> {
  public static readonly instance = new ProductRoutes();

  private constructor() {
    super('product', ProductController.instance, productBody, productResponse);
  }
}
