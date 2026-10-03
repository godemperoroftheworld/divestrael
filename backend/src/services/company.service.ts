import PrismaService, { PrismaServiceParams } from '@/services/PrismaService';
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

  public async getWithRelations(id: string): Promise<PrismaModelExpanded<'Company'>> {
    return this.getOne(id, { include: ['brands'] });
  }

  // I am out of search indices in my free mongo db, so search runs against alias
  public override async searchOne(
    query: string,
    fuzzy: boolean = true,
    params: Pick<PrismaServiceParams<'Company'>, 'include' | 'select' | 'omit'> = {},
    minScore: number = 3,
  ): Promise<PrismaModelExpanded<'Company'> | null> {
    return CompanyAliasService.instance.searchOneCompany(query, params, fuzzy, minScore);
  }
}
