import { CompanyResolver, CompanyQuery } from '@/resolver/company/company.resolver.types';
import CompanyAliasService from '@/services/company-alias.service';

export default class AliasCompanyResolver extends CompanyResolver {
  public async resolve({ name }: CompanyQuery) {
    if (name) {
      const result = await CompanyAliasService.instance.searchOne(name, true, {
        include: ['company.brands'],
      });
      return result?.company ?? null;
    }
    return null;
  }
}
