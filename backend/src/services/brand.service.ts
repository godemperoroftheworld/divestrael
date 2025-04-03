import { Company } from '@prisma/client';
import { Brand } from '.prisma/client';

import prisma from '@/prisma';
import { ERRORS } from '@/helpers/errors.helper';

export interface BrandWithCompany extends Brand {
  company: Company;
}

// Service to get barcode information
export default class BrandService {
  private static _instance: BrandService;

  public static get instance() {
    if (!BrandService._instance) {
      BrandService._instance = new BrandService();
    }
    return BrandService._instance;
  }

  private readonly brandRepository = prisma.brand;
  private constructor() {}

  async getBrand(id: string): Promise<BrandWithCompany> {
    return this.brandRepository.findUniqueOrThrow({
      where: { id },
      include: { company: true },
    });
  }

  async searchBrand(query: string): Promise<BrandWithCompany | undefined> {
    return (
      await this.brandRepository.aggregateRaw({
        pipeline: [
          {
            $search: {
              index: 'search',
              text: {
                query,
                path: ['name'],
                fuzzy: {},
              },
            },
          },
          {
            $limit: 1,
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'companyId',
              foreignField: '_id',
              as: 'company',
            },
          },
          {
            $project: {
              _id: 0,
              id: {
                $toString: '$_id',
              },
              name: 1,
              company: 1,
            },
          },
        ],
      })
    )[0] as BrandWithCompany | undefined;
  }

  async createBrand({ name, companyId }: Omit<Brand, 'id'>): Promise<BrandWithCompany> {
    // Check for conflict
    const matchingBrand = await this.searchBrand(name);
    if (matchingBrand) {
      throw ERRORS.companyExists;
    }
    return this.brandRepository.create({
      data: {
        name,
        companyId,
      },
      include: { company: true },
    });
  }

  async createBrands(brands: Omit<Brand, 'id'>[]): Promise<Brand[]> {
    const brandNames = brands.map((b) => b.name);
    const brandCompanies = brands.map((b) => b.companyId);
    const existingBrands = await this.brandRepository.findMany({
      where: { AND: [{ name: { in: brandNames } }, { companyId: { in: brandCompanies } }] },
    });
    const uniqueBrands = brands.filter((b) => !existingBrands.some((b2) => b.name === b2.name));
    await this.brandRepository.createMany({
      data: uniqueBrands,
    });
    return this.brandRepository.findMany({
      where: { name: { in: brandNames } },
      include: { company: true },
    });
  }

  async searchOrCreateBrand(data: Omit<Brand, 'id'>): Promise<BrandWithCompany> {
    const product = await this.searchBrand(data.name);
    if (product) {
      return product;
    }
    return this.createBrand({ name: data.name, companyId: data.name });
  }
}
