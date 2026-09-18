import { ResolverPipeline } from '@/resolver/resolver';
import { Company } from '@/schemas/zod';
import AliasCompanyResolver from '@/resolver/company/alias.company.resolver';
import CorpwatchCompanyResolver from '@/resolver/company/corpwatch.company.resolver';
import CompanyProvider from '@/resolver/company/company.provider';
import IdCompanyResolver from '@/resolver/company/id.company.resolver';
import { CompanyQuery } from '@/resolver/company/company.resolver.types';

export { CompanyQuery, CompanyResolver } from '@/resolver/company/company.resolver.types';

export default class CompanyResolverPipeline extends ResolverPipeline<CompanyQuery, Company> {
  private static readonly instance = new CompanyResolverPipeline();

  public static async resolve(query: CompanyQuery): Promise<Company> {
    return this.instance.resolve(query);
  }

  private constructor() {
    super(
      [new IdCompanyResolver(), new AliasCompanyResolver(), new CorpwatchCompanyResolver()],
      new CompanyProvider(),
    );
  }
}
