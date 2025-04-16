import PrismaRoute from '@/routes/PrismaRoute';
import CompanyController from '@/controllers/company.controller';
import { CompanyPartialWithRelationsSchema, CompanySchema } from '@/schemas/zod';

export default class CompanyRoute extends PrismaRoute<'Company'> {
  public static readonly instance = new CompanyRoute();

  private constructor() {
    super('company', CompanyController.instance, CompanySchema, CompanyPartialWithRelationsSchema);
  }
}
