import z from 'zod';

import { productResponse } from '@/schemas/product.schema';

export const barcodeParams = z.object({
  code: z.string(),
});
export type BarcodeParams = z.infer<typeof barcodeParams>;

export const barcodeBody = z.object({
  productId: z.string().nonempty().optional(),
});
export type BarcodeBody = z.infer<typeof barcodeBody>;

export const barcodeResponse = z.object({
  barcode: z.string(),
  product: productResponse.optional(),
});
export type BarcodeResponse = z.infer<typeof barcodeResponse>;
