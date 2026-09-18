import { Country } from '@prisma/client';

import { CompanyQuery } from '@/resolver/company/company.resolver.types';
import { Provider } from '@/resolver/resolver';
import AIService from '@/services/generator.service';
import { Company } from '@/schemas/zod';
import CorpwatchService from '@/services/corpwatch.service';
import CompanyService from '@/services/company.service';
import CompanyAliasService from '@/services/company-alias.service';

export default class CompanyProvider extends Provider<CompanyQuery, Company> {
  public async provide(query: CompanyQuery): Promise<Company> {
    const { brand, product } = query;
    let { name, country } = query;
    if (!name && brand) {
      const info = await AIService.instance.generateCompanyInfo(brand, product);
      name = info.name;
      country = info.country;
    }

    const { description, url } = await AIService.instance.getMetadata(name!);
    const corpwatch = await CorpwatchService.instance.findTopCompany(name!);

    const { id } = await CompanyService.instance.createOne({
      name: corpwatch?.company_name ?? name!,
      description,
      url,
      reasons: [],
      cw_id: corpwatch?.cw_id ?? null,
      country: country ?? corpwatch?.country_code ?? Country.US,
      source: null,
    });
    // Create aliases
    const aliases = [{ name: name!, companyId: id }];
    if (corpwatch) {
      aliases.push({ name: corpwatch.company_name, companyId: id });
    }
    await CompanyAliasService.instance.createMany(aliases);
    // Return company
    return await CompanyService.instance.getOne(id);
  }
}
