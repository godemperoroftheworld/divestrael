import axios, { AxiosInstance } from 'axios';
import { Barcode } from '@prisma/client';

import ProductService, { ProductWithBrand } from '@/services/product.service';
import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

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

export default class BarcodeService extends PrismaService<'Barcode'> {
  public static readonly instance = new BarcodeService();

  protected override searchPaths() {
    return ['code'];
  }

  protected override lookup() {
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

  public async getOrCreateByCode(
    code: string,
    productId?: string,
  ): Promise<PrismaModelExpanded<'Barcode'>> {
    try {
      return this.getOneByProperty('code', code);
    } catch (_ignored) {
      const { data } = await this.axiosInstance.get<BarcodeAPIResponse>('/lookup', {
        params: { upc: code },
      });
      const { title, brand } = data.items[0];
      let product: PrismaModelExpanded<'Product'>;
      if (productId) {
        product = await ProductService.instance.getOne(productId);
      } else {
        product = await ProductService.instance.getOrCreateByName(title, brand);
      }
      return this.createOne({ code, productId: product.id });
    }
  }
}
