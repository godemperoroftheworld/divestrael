import { BrandResponse } from '@/schemas/brand.schema';
import BrandService, { BrandWithCompany } from '@/services/brand.service';
import brandMapper from '@/controllers/mappers/brand.mapper';
import PrismaController from '@/controllers/PrismaController';

export default class BrandController extends PrismaController<'Brand', BrandResponse> {
  public static readonly instance = new BrandController();

  private constructor() {
    super(BrandService.instance);
  }

  protected mapData(data: BrandWithCompany): BrandResponse {
    return brandMapper(data);
  }
}
