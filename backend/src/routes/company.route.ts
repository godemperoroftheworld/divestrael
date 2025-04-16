import { companyBody, companyResponse } from '@/schemas/company.schema';
import PrismaRoute from '@/routes/PrismaRoute';
import { CompanyWithBrands } from '@/services/company.service';
import CompanyController from '@/controllers/company.controller';

export default class CompanyRoute extends PrismaRoute<'Company', CompanyWithBrands> {
  public static readonly instance = new CompanyRoute();

  private constructor() {
    super('company', CompanyController.instance, companyBody, companyResponse);
  }
}
