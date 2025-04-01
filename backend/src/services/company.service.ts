import { Company, Country } from '@prisma/client';
import { Brand } from '.prisma/client';

import prisma from '@/repositories/prisma.repository';
import { CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import CorpwatchService from '@/services/corpwatch.service';
import { ERRORS } from '@/helpers/errors.helper';
import KGService from '@/services/knowledgegraph.service';
import AIService from '@/services/ai.service';

export default class CompanyService {
  private static _instance: CompanyService;

  private readonly companyRepository = prisma.company;
  private constructor() {}

  static get instance() {
    if (!CompanyService._instance) {
      CompanyService._instance = new CompanyService();
    }
    return CompanyService._instance;
  }

  private static mapCompany(company: Company & { brands: Brand[] }): CompanyResponse {
    const { name, description, image, source, reasons, brands, country } = company;
    return {
      name,
      description,
      brands: brands.map((brand) => brand.name),
      image: image ?? undefined,
      reasons: reasons ?? undefined,
      source: source ?? undefined,
      country,
    };
  }

  async getCompany(id: string): Promise<CompanyResponse> {
    const result = await this.companyRepository.findUniqueOrThrow({
      where: { id },
      include: { brands: true },
    });
    return CompanyService.mapCompany(result);
  }

  async findCompanyByCIK(cik: number) {
    const result: Company = this.companyRepository.findUnique({
      where: { cik },
      include: { brands: true },
    });
    if (result) {
      return CompanyService.mapCompany(result);
    }
    return null;
  }

  async createCompany(data: CompanyPostBody): Promise<CompanyResponse> {
    const { name, reasons, source, country } = data;
    const company = await CorpwatchService.instance.findTopCompany(name);
    const matchingCompany = company
      ? await prisma.company.findFirst({
          where: { OR: [{ cw_id: company.cw_id }, { name }] },
          include: { brands: true },
        })
      : undefined;
    if (matchingCompany) {
      throw ERRORS.companyExists;
    }
    const description = await KGService.instance.getDescription(name);
    const brandNames = await AIService.instance.getBrands(name, country);
    const image = await KGService.instance.getImage(name);
    const result = await prisma.company.create({
      data: {
        name,
        description,
        reasons,
        source,
        image,
        cw_id: company?.cw_id,
        cik: company?.cik,
        country: country ?? company?.country_code ?? Country.US,
      },
    });
    if (brandNames.length) {
      await prisma.brand.createMany({
        data: brandNames.map((name) => ({
          name,
          companyId: result.id,
        })),
      });
    }
    return {
      name,
      description,
      image,
      reasons,
      source,
      brands: brandNames,
      country: result.country,
    };
  }
}
