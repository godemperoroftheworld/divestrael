import ProductService from '@/services/product.service';
import PrismaController from '@/controllers/PrismaController';

export default class ProductController extends PrismaController<'Product'> {
  public static readonly instance = new ProductController();

  private constructor() {
    super(ProductService.instance);
  }
}
