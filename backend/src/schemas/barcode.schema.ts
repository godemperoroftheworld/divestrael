import z from 'zod';

import { productResponse } from '@/schemas/product.schema';

export const barcodeBody = z.object({
  code: z.string(),
  productId: z.string(),
});
export type BarcodeBody = z.infer<typeof barcodeBody>;

export const barcodeResponse = z.object({
  barcode: z.string(),
  product: productResponse.optional(),
});
export type BarcodeResponse = z.infer<typeof barcodeResponse>;
