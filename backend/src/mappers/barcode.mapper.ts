import { BarcodeWithData } from '@/services/barcode.service';
import { BarcodeResponse } from '@/schemas/barcode.schema';
import productMapper from '@/mappers/product.mapper';

function barcodeMapper(data: BarcodeWithData): BarcodeResponse {
  return {
    barcode: data.code,
    product: productMapper(data.product),
  };
}

export default barcodeMapper;
