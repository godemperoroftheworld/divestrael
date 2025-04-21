import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Barcode from '@/types/api/barcode';

const useBarcodes = createAllQuery(Barcode, 'barcode');
const useSearchBarcodes = createSearchQuery(Barcode, 'barcode');
const useBarcode = createOneQuery(Barcode, 'barcode');

export { useBarcodes, useSearchBarcodes, useBarcode };
