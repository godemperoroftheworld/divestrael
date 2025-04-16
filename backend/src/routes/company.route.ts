import { companyBody, companyResponse } from '@/schemas/company.schema';
import PrismaRoute from '@/routes/PrismaRoute';
import CompanyController from '@/controllers/company.controller';

export default class CompanyRoute extends PrismaRoute<'Company'> {
  public static readonly instance = new CompanyRoute();

  private constructor() {
    super('company', CompanyController.instance, companyBody, companyResponse);
  }
}
