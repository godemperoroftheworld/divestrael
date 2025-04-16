import BrandService from '@/services/brand.service';
import PrismaController from '@/controllers/PrismaController';

export default class BrandController extends PrismaController<'Brand'> {
  public static readonly instance = new BrandController();

  private constructor() {
    super(BrandService.instance);
  }
}
