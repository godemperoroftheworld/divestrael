import { CompanyResolver, CompanyQuery } from '@/resolver/company/company.resolver.types';
import CompanyService from '@/services/company.service';

export default class IdCompanyResolver extends CompanyResolver {
  public override async resolve({ id }: CompanyQuery) {
    if (id) {
      return CompanyService.instance.getOne(id);
    }
    return null;
  }
}
