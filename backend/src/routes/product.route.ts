import { productBody, productResponse } from '@/schemas/product.schema';
import ProductController from '@/controllers/product.controller';
import PrismaRoute from '@/routes/PrismaRoute';
import { ProductWithBrand } from '@/services/product.service';

export default class ProductRoutes extends PrismaRoute<'Product', ProductWithBrand> {
  public static readonly instance = new ProductRoutes();

  private constructor() {
    super(ProductController.instance, productBody, productResponse);
  }
}
