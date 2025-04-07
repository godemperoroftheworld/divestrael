import axios, { AxiosInstance } from 'axios';
import { Barcode, Product } from '@prisma/client';

import ProductService, { ProductWithBrand } from '@/services/product.service';
import PrismaService from '@/services/PrismaService';
import BrandService, { BrandWithCompany } from '@/services/brand.service';
import AIService from '@/services/generator.service';
import CompanyService from '@/services/company.service';

export interface BarcodeWithData extends Barcode {
  product: ProductWithBrand;
}

interface BarcodeAPIResponse {
  total: number;
  items: Array<{
    ean: string;
    title: string;
    upc: string;
    gtin: string;
    asin: string;
    description: string;
    brand: string;
  }>;
}

export default class BarcodeService extends PrismaService<'Barcode', 'barcode', BarcodeWithData> {
  public static readonly instance = new BarcodeService();

  public static override searchPaths() {
    return ['code'];
  }

  public static override baseIncludes() {
    return {
      product: {
        include: {
          brand: {
            include: {
              company: true,
            },
          },
        },
      },
    };
  }

  public static override lookup() {
    return {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product',
    };
  }

  private readonly axiosInstance: AxiosInstance;
  private constructor() {
    super('barcode');
    this.axiosInstance = axios.create({
      baseURL: 'https://api.upcitemdb.com/prod/trial',
    });
    // Add Authorization Header
    this.axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${process.env.BARCODE_API_KEY}`;
  }

  public async getOrCreateByCode(code: string, productId?: string): Promise<BarcodeWithData> {
    try {
      return this.getOneByProperty('code', code);
    } catch (_ignored) {
      const { data } = await this.axiosInstance.get<BarcodeAPIResponse>('/lookup', {
        params: { upc: code },
      });
      const { title, brand } = data.items[0];
      let product: ProductWithBrand;
      if (productId) {
        product = await ProductService.instance.getOne(productId);
      } else {
        product = await ProductService.instance.getOrCreateByName(title, brand);
      }
      return this.createOne({ code, productId: product.id });
    }
  }
}
