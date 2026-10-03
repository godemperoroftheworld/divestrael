import { Country } from '@prisma/client';

import { CompanyQuery } from '@/resolver/company/company.resolver.types';
import { Provider } from '@/resolver/resolver';
import AIService from '@/services/generator.service';
import { Company } from '@/schemas/zod';
import CorpwatchService from '@/services/corpwatch.service';
import CompanyService from '@/services/company.service';
import CompanyAliasService from '@/services/company-alias.service';
import { ERRORS, isUniqueViolation } from '@/helpers/errors.helper';

export default class CompanyProvider extends Provider<CompanyQuery, Company> {
  public async provide(query: CompanyQuery): Promise<Company> {
    const { brand, product } = query;
    let { name, country } = query;
    if (!name && brand) {
      const info = await AIService.instance.generateCompanyInfo(brand, product);
      name = info.name;
      country = info.country;
    }
    name = name?.trim();
    if (!name) {
      throw ERRORS.noCompanyFound;
    }

    const { description, url } = await AIService.instance.getMetadata(name);
    const corpwatch = await CorpwatchService.instance.findTopCompany(name);

    const resolvedName = corpwatch?.company_name ?? name;
    const { id } = await CompanyService.instance.createOne({
      name: resolvedName,
      description,
      url,
      reasons: [],
      cw_id: corpwatch?.cw_id ?? null,
      country: country ?? corpwatch?.country_code ?? Country.US,
      source: null,
    });
    // Create aliases
    const aliases = [{ name, companyId: id }];
    if (resolvedName !== name) {
      aliases.push({ name: resolvedName, companyId: id });
    }
    await CompanyAliasService.instance.createMany(aliases);
    // Return company
    return await this.create(resolvedName, id);
  }

  private async create(name: string, id: string) {
    try {
      return await CompanyService.instance.getOne(id);
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      // Lost a race against a concurrent request.
      const raced = await CompanyService.instance.getOneByProperty('name', name);
      if (raced) return raced;
      throw ERRORS.brandExists;
    }
  }
}
