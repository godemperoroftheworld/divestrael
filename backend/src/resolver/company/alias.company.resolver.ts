import { CompanyResolver, CompanyQuery } from '@/resolver/company/company.resolver.types';
import CompanyAliasService from '@/services/company-alias.service';
import CompanyService from '@/services/company.service';
import { areNamesSimilar } from '@/utils';

export default class AliasCompanyResolver extends CompanyResolver {
  public async resolve({ name }: CompanyQuery) {
    if (!name) return null;

    const exact = await CompanyAliasService.instance.findCompanyByAlias(name);
    if (exact) return exact;

    const candidate = await CompanyAliasService.instance.searchOne(name, true, {}, 0);
    if (candidate && areNamesSimilar(candidate.name, name)) {
      return CompanyService.instance.getWithRelations(candidate.companyId);
    }
    return null;
  }
}
