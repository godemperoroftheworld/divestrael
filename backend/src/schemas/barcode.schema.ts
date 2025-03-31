import z from 'zod';

export const barcodeGetParams = z.object({
  barcode: z.string(),
});
export type BarcodeGetParams = z.infer<typeof barcodeGetParams>;

export const barcodeResponse = z.object({
  barcode: z.string(),
  title: z.string(),
  brand: z.string(),
  company: z.string(),
  image: z.string(),
});
export type BarcodeResponse = z.infer<typeof barcodeResponse>;
