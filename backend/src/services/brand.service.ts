import { Company } from '@prisma/client';
import { Brand } from '.prisma/client';

import PrismaService from '@/services/PrismaService';
import { ERRORS } from '@/helpers/errors.helper';
import AIService from '@/services/generator.service';
import CompanyService from '@/services/company.service';

export interface BrandWithCompany extends Brand {
  company: Company;
}

export default class BrandService extends PrismaService<'Brand', BrandWithCompany> {
  public static readonly instance = new BrandService();

  protected override baseIncludes() {
    return { company: true };
  }

  protected override lookup() {
    return {
      from: 'companies',
      localField: 'companyId',
      foreignField: '_id',
      as: 'company',
    };
  }

  protected override searchPaths(): string[] {
    return ['name'];
  }

  protected override fields(): (keyof BrandWithCompany)[] {
    return ['name', 'company'];
  }

  private constructor() {
    super('brand');
  }

  public async getOrCreateByName(name: string, product?: string) {
    const brand = await this.searchOne(name, true);
    if (brand) {
      return brand;
    }

    if (!product) {
      throw ERRORS.noCompanyFound;
    }

    const { country, name: companyName } = await AIService.instance.generateCompanyInfo(
      product,
      name,
    );
    const company = await CompanyService.instance.getOrCreateByName(companyName, country);
    return this.createOne({
      name,
      companyId: company.id,
    });
  }
}
