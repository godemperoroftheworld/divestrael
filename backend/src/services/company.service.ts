import { Company, Country } from '@prisma/client';
import { Brand } from '.prisma/client';

import PrismaService from '@/services/PrismaService';
import AIService from '@/services/generator.service';
import CorpwatchService from '@/services/corpwatch.service';

export interface CompanyWithBrands extends Company {
  brands: Brand[];
}

export default class CompanyService extends PrismaService<'Company', CompanyWithBrands> {
  public static readonly instance: CompanyService = new CompanyService();

  protected override lookup() {
    return {
      from: 'brands',
      localField: '_id',
      foreignField: 'companyId',
      as: 'brands',
    };
  }

  protected searchPaths(): string[] {
    return ['name'];
  }

  protected override fields(): (keyof CompanyWithBrands)[] {
    return [
      'name',
      'brands',
      'description',
      'image',
      'country',
      'reasons',
      'source',
      'cw_id',
      'cik',
    ];
  }

  private constructor() {
    super('company');
  }

  public async getOrCreateByName(name: string, country?: Country) {
    const company = await this.searchOne(name);
    if (company) {
      return company;
    }

    const corpwatch = await CorpwatchService.instance.findTopCompany(name);
    const { description, image } = await AIService.instance.getMetadata(name);

    return this.createOne({
      name,
      description,
      image,
      reasons: [],
      cik: corpwatch?.cik ?? null,
      cw_id: corpwatch?.cw_id ?? null,
      country: country ?? corpwatch?.country_code ?? Country.US,
      source: null,
    });
  }
}
