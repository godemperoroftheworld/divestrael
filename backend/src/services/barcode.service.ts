import axios, { AxiosInstance } from 'axios';
import { Barcode, Company, Product } from '@prisma/client';
import { Brand } from '.prisma/client';

import prisma from '@/repositories/prisma.repository';
import AIService from '@/services/ai.service';
import CompanyService from '@/services/company.service';

interface BarcodeApiResult {
  title: string;
  brand: string;
  barcode: string;
}

interface BrandWithCompany extends Brand {
  company: Company;
}

interface ProductWithBrand extends Product {
  brand: BrandWithCompany;
}

export interface BarcodeWithData extends Barcode {
  product: ProductWithBrand;
}

// Service to get barcode information
export default class BarcodeService {
  private static _instance: BarcodeService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!BarcodeService._instance) {
      BarcodeService._instance = new BarcodeService();
    }
    return BarcodeService._instance;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.upcitemdb.com/prod/trial',
    });
    // Add Authorization Header
    this.axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${process.env.BARCODE_API_KEY}`;
  }

  public async updateBarcode(
    id: string,
    product: Partial<Product>,
    brand: Partial<Brand>,
  ): Promise<BarcodeWithData> {
    const { productId } = await prisma.barcode.findUniqueOrThrow({ where: { id } });
    const { brandId } = await prisma.product.update({
      where: { id: productId },
      data: product,
    });
    await prisma.brand.update({
      where: { id: brandId },
      data: brand,
    });
    return prisma.barcode.findUniqueOrThrow({
      where: { id },
      include: {
        product: {
          include: {
            brand: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  public async getBarcode(barcode: string): Promise<BarcodeWithData> {
    // First try DB
    const barcodeResult = await prisma.barcode.findUnique({
      where: { code: barcode },
      include: { product: { include: { brand: { include: { company: true } } } } },
    });
    if (barcodeResult) {
      return barcodeResult;
    }
    // Then query API
    const result = await this.axiosInstance
      .get<{ items: BarcodeApiResult[] }>('lookup', {
        params: {
          upc: barcode,
        },
      })
      .then((r) => r.data.items[0]);
    // Get or create company
    const { name, country } = await AIService.instance.getCompany(result.title, result.brand);
    let company = await CompanyService.instance.searchCompany(name);
    if (!company) {
      company = await CompanyService.instance.createCompany({
        name,
        country,
        reasons: [],
      });
    }
    // Get or create brand
    let brand = await prisma.brand.findUnique({ where: { name: result.brand } });
    if (!brand) {
      brand = await prisma.brand.create({ data: { name: result.brand, companyId: company.id } });
    }
    // Save to DB
    return prisma.barcode.create({
      data: {
        code: barcode,
        product: {
          connectOrCreate: {
            where: {
              name: result.title,
            },
            create: {
              name: result.title,
              brand: {
                connect: {
                  id: brand.id,
                },
              },
            },
          },
        },
      },
      include: {
        product: {
          include: {
            brand: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }
}
