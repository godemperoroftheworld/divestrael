import PrismaService, { PrismaServiceParams } from '@/services/PrismaService';
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
    params: Pick<PrismaServiceParams<'Company'>, 'include' | 'select' | 'omit'> = {},
    fuzzy = false,
    minScore = 3,
  ): Promise<PrismaModelExpanded<'Company'> | null> {
    const result = fuzzy
      ? await this.searchOne(alias, true, {}, minScore)
      : await this.getOneByProperty('name', alias);
    if (result) {
      return CompanyService.instance.getOne(result.companyId, params);
    }
    return null;
  }

  public async findCompanyByAlias(alias: string): Promise<PrismaModelExpanded<'Company'> | null> {
    const result = await this.getOneByProperty('name', alias);
    if (result) {
      return CompanyService.instance.getWithRelations(result.companyId);
    }
    return null;
  }
}
