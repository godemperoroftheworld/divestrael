import z from 'zod';
import { BoycottReason } from '@prisma/client';

export const barcodeParams = z.object({
  barcode: z.string().nonempty(),
});
export type BarcodeParams = z.infer<typeof barcodeParams>;

export const barcodeBody = z.object({
  title: z.string().optional(),
  brand: z.string().optional(),
});
export type BarcodeBody = z.infer<typeof barcodeBody>;

export const barcodeResponse = z.object({
  barcode: z.string(),
  title: z.string(),
  brand: z.string().optional(),
  company: z.string(),
  image: z.string().optional(),
  boycott: z.boolean(),
  reasons: z.array(z.nativeEnum(BoycottReason)).optional(),
  source: z.string().optional(),
});
export type BarcodeResponse = z.infer<typeof barcodeResponse>;
