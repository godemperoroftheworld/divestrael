import axios, { AxiosInstance } from 'axios';
import { Barcode } from '@prisma/client';

import prisma from '@/prisma';
import AIService from '@/services/generator.service';
import CompanyService from '@/services/company.service';
import { ProductWithBrand } from '@/services/product.service';
import barcodeController from '@/controllers/barcode.controller';

interface BarcodeApiResult {
  title: string;
  brand: string;
  barcode: string;
}

export interface BarcodeWithData extends Barcode {
  product: ProductWithBrand;
}

// Service to get barcode information
export default class BarcodeService {
  private static _instance: BarcodeService;
  private static readonly INCLUDE = {
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

  private readonly barcodeRepository = prisma.barcode;
  private readonly axiosInstance: AxiosInstance;

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

  async getBarcode(id: string): Promise<BarcodeWithData> {
    return this.barcodeRepository.findUniqueOrThrow({
      where: { id },
      include: BarcodeService.INCLUDE,
    });
  }

  async searchBarcode(code: string): Promise<BarcodeWithData | null> {
    return this.barcodeRepository.findUnique({
      where: { code },
      include: BarcodeService.INCLUDE,
    });
  }

  async createBarcode({ code, productId }: Omit<Barcode, 'id'>): Promise<BarcodeWithData> {
    return this.barcodeRepository.create({
      data: {
        code,
        productId,
      },
      include: BarcodeService.INCLUDE,
    });
  }

  async searchOrCreateBarcode(data: Omit<Barcode, 'id'>): Promise<BarcodeWithData> {
    let barcode = await this.searchBarcode(data.code);
    if (!barcode) {
      barcode = await this.createBarcode(data);
    }
    return barcode as BarcodeWithData;
  }
}
