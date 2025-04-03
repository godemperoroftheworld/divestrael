import { Product } from '@prisma/client';

import { ProductWithBrand } from '@/services/product.service';
import { ProductResponse } from '@/schemas/product.schema';
import brandMapper from '@/mappers/brand.mapper';

function productMapper(product: ProductWithBrand | Product): ProductResponse {
  const { name } = product;
  let brand = undefined;
  if ('brand' in product) {
    brand = product.brand;
  }
  return {
    title: name,
    brand: brand ? brandMapper(brand) : undefined,
  };
}

export default productMapper;
