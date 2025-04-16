import CompanyService from '@/services/company.service';
import PrismaController from '@/controllers/PrismaController';

export default class CompanyController extends PrismaController<'Company'> {
  public static readonly instance = new CompanyController();

  private constructor() {
    super(CompanyService.instance);
  }
}
