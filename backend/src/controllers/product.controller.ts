import { ProductResponse } from '@/schemas/product.schema';
import ProductService, { ProductWithBrand } from '@/services/product.service';
import productMapper from '@/controllers/mappers/product.mapper';
import PrismaController from '@/controllers/PrismaController';

export default class ProductController extends PrismaController<
  'Product',
  'product',
  ProductResponse,
  ProductWithBrand
> {
  public static readonly instance = new ProductController();

  private constructor() {
    super(ProductService.instance);
  }

  protected mapData(data: ProductWithBrand): ProductResponse {
    return productMapper(data);
  }
}
