import axios, { AxiosInstance } from 'axios';

import ProductService from '@/services/product.service';
import PrismaService from '@/services/PrismaService';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

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
      return await this.getOneByProperty('code', code, { include: ['product.brand.company'] });
    } catch (_ignored) {
      const { data } = await this.axiosInstance.get<BarcodeAPIResponse>('/lookup', {
        params: { upc: code },
      });
      if (!data.items?.length) {
        return { code, id: '', productId: '' };
      }
      const { title, brand } = data.items[0];
      let product: PrismaModelExpanded<'Product'>;
      if (productId) {
        product = await ProductService.instance.getOne(productId, { include: ['brand.company'] });
      } else {
        product = await ProductService.instance.getOrCreateByName(title, brand);
      }
      const barcode = await this.createOne({ code, productId: product.id });
      return { ...barcode, product };
    }
  }
}
