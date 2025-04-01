import { Company, Country } from '@prisma/client';
import { Brand } from '.prisma/client';

import prisma from '@/repositories/prisma.repository';
import { CompanyPostBody } from '@/schemas/company.schema';
import CorpwatchService from '@/services/corpwatch.service';
import { ERRORS } from '@/helpers/errors.helper';
import KGService from '@/services/knowledgegraph.service';
import AIService from '@/services/ai.service';

export interface CompanyWithBrands extends Company {
  brands: Brand[];
}

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

  async getCompany(id: string): Promise<CompanyWithBrands> {
    return this.companyRepository.findUniqueOrThrow({
      where: { id },
      include: { brands: true },
    });
  }

  async findCompanyByCIK(cik: number): Promise<CompanyWithBrands | null> {
    return this.companyRepository.findUnique({
      where: { cik },
      include: { brands: true },
    });
  }

  async searchCompany(query: string) {
    return (
      await this.companyRepository.aggregateRaw({
        pipeline: [
          {
            $search: {
              index: 'search',
              text: {
                query,
                path: ['name'],
              },
            },
          },
          {
            $limit: 1,
          },
          {
            $lookup: {
              from: 'brands',
              localField: '_id',
              foreignField: 'companyId',
              as: 'brands',
            },
          },
          {
            $project: {
              _id: 0,
              name: 1,
              cik: 1,
              cw_id: 1,
              description: 1,
              country: 1,
              image: 1,
              reasons: 1,
              source: 1,
              brands: 1,
            },
          },
        ],
      })
    )[0] as CompanyWithBrands | undefined;
  }

  async createCompany(data: CompanyPostBody): Promise<CompanyWithBrands> {
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
    return prisma.company.findUniqueOrThrow({
      where: { id: result.id },
      include: { brands: true },
    });
  }
}
