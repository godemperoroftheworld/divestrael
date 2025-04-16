import { BarcodeResponse } from '@/schemas/barcode.schema';
import productMapper from '@/controllers/mappers/product.mapper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

function barcodeMapper(data: PrismaModelExpanded<'Barcode'>): BarcodeResponse {
  return {
    barcode: data.code,
    product: data.product ? productMapper(data.product) : undefined,
  };
}

export default barcodeMapper;
