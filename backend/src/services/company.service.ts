import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import CompanyAliasService from '@/services/company-alias.service';

export default class CompanyService extends PrismaService<'Company'> {
  public static readonly instance: CompanyService = new CompanyService();

  protected override searchPath(): string {
    return 'name';
  }

  private constructor() {
    super('company');
  }

  // I am out of search indices in my free mongo db
  public override async searchOne(
    query: string,
    fuzzy: boolean = true,
  ): Promise<PrismaModelExpanded<'Company'> | null> {
    return CompanyAliasService.instance.searchOneCompany(query, fuzzy);
  }
}
