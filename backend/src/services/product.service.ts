import { Product } from '@prisma/client';

import prisma from '@/prisma';
import { ERRORS } from '@/helpers/errors.helper';
import { BrandWithCompany } from '@/services/brand.service';

export interface ProductWithBrand extends Product {
  brand: BrandWithCompany;
}

// Service to get barcode information
export default class ProductService {
  private static _instance: ProductService;

  public static get instance() {
    if (!ProductService._instance) {
      ProductService._instance = new ProductService();
    }
    return ProductService._instance;
  }

  private readonly productRepository = prisma.product;
  private constructor() {}

  async getProduct(id: string): Promise<ProductWithBrand> {
    return this.productRepository.findUniqueOrThrow({
      where: { id: id },
      include: { brand: { include: { company: true } } },
    });
  }

  public async searchProduct(query: string) {
    return (
      await this.productRepository.aggregateRaw({
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
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $project: {
              _id: 0,
              id: {
                $toString: '$_id',
              },
              name: 1,
              brand: 1,
            },
          },
        ],
      })
    )[0] as ProductWithBrand | undefined;
  }

  async createProduct({ name, brandId }: Omit<Product, 'id'>): Promise<ProductWithBrand> {
    // Check for conflict
    const matchingProduct = await this.searchProduct(name);
    if (matchingProduct && matchingProduct.brand.id === brandId) {
      throw ERRORS.companyExists;
    }
    return this.productRepository.create({
      data: {
        name,
        brandId,
      },
      include: { brand: { include: { company: true } } },
    });
  }

  public async searchOrCreateProduct(data: Omit<Product, 'id'>): Promise<ProductWithBrand> {
    const product = await this.searchProduct(data.name);
    if (product) {
      return product;
    }
    return this.createProduct({ name: data.name, brandId: data.brandId });
  }
}
