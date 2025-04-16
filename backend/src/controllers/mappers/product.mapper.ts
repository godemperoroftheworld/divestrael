import { ProductResponse } from '@/schemas/product.schema';
import brandMapper from '@/controllers/mappers/brand.mapper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

function productMapper(product: PrismaModelExpanded<'Product'>): ProductResponse {
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
