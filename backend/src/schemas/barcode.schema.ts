import z from 'zod';
import { BoycottReason } from '@prisma/client';

export const barcodeGetParams = z.object({
  barcode: z.string().nonempty(),
});
export type BarcodeGetParams = z.infer<typeof barcodeGetParams>;

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
