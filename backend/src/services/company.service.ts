import { Country } from '@prisma/client';

import PrismaService from '@/services/PrismaService';
import AIService from '@/services/generator.service';
import CorpwatchService from '@/services/corpwatch.service';
import BrandService from '@/services/brand.service';

export default class CompanyService extends PrismaService<'Company'> {
  public static readonly instance: CompanyService = new CompanyService();

  protected searchPaths(): string[] {
    return ['name'];
  }

  private constructor() {
    super('company');
  }

  public async getOrCreateByName(name: string, country?: Country) {
    const company = await this.searchOne(name, true, { include: ['brands'] });
    if (company) {
      return company;
    }

    const corpwatch = await CorpwatchService.instance.findTopCompany(name);
    const { description, url } = await AIService.instance.getMetadata(name);

    const { id } = await this.createOne(
      {
        name,
        description,
        url,
        reasons: [],
        cik: corpwatch?.cik ?? null,
        cw_id: corpwatch?.cw_id ?? null,
        country: country ?? corpwatch?.country_code ?? Country.US,
        source: null,
      },
      {
        include: ['id'],
      },
    );
    await BrandService.instance.createForCompany(id, { include: ['id'] });
    return this.getOne(id, { include: ['brands'] });
  }
}
