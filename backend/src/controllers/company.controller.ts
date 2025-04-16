import CompanyService, { CompanyWithBrands } from '@/services/company.service';
import companyMapper from '@/controllers/mappers/company.mapper';
import { CompanyResponse } from '@/schemas/company.schema';
import PrismaController from '@/controllers/PrismaController';

export default class CompanyController extends PrismaController<
  'Company',
  CompanyResponse,
  CompanyWithBrands
> {
  public static readonly instance = new CompanyController();

  private constructor() {
    super(CompanyService.instance);
  }

  protected mapData(data: CompanyWithBrands): CompanyResponse {
    return companyMapper(data);
  }
}
