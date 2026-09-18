import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import CompanyService from '@/services/company.service';

export default class CompanyAliasService extends PrismaService<'CompanyAlias'> {
  public static readonly instance: CompanyAliasService = new CompanyAliasService();

  private constructor() {
    super('companyAlias');
  }

  protected searchPath(): string {
    return 'name';
  }

  // Workaround for no more search indices
  public async searchOneCompany(
    alias: string,
    fuzzy?: boolean,
  ): Promise<PrismaModelExpanded<'Company'> | null> {
    const result = await this.searchOne(alias, fuzzy);
    if (result) {
      return CompanyService.instance.getOne(result.companyId);
    }
    return null;
  }
}
