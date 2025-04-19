import { createAllQuery, createOneQuery } from '@/utils/query';
import Barcode from '@/types/api/barcode';

const useBarcodes = createAllQuery(Barcode, 'barcode');
const useBarcode = createOneQuery(Barcode, 'barcode');

export { useBarcodes, useBarcode };
