import { CompanyResolver, CompanyQuery } from '@/resolver/company/company.resolver.types';
import { Company } from '@/schemas/zod';
import CorpwatchService from '@/services/corpwatch.service';
import CompanyAliasService from '@/services/company-alias.service';

export default class CorpwatchCompanyResolver extends CompanyResolver {
  public async resolve({ name }: CompanyQuery): Promise<Company | null> {
    if (name) {
      const corpwatch = await CorpwatchService.instance.findTopCompany(name);
      if (corpwatch) {
        return await CompanyAliasService.instance.searchOneCompany(corpwatch.company_name);
      }
    }
    return null;
  }
}
