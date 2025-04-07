import z from 'zod';
import { Country } from '@prisma/client';

export const allInclusiveCompany = z.object({
  name: z.string().nonempty(),
  country: z.nativeEnum(Country),
});
export type AllInclusiveCompany = z.infer<typeof allInclusiveCompany>;

export const allInclusiveProduct = z.object({
  name: z.string().nonempty(),
  brand: z.string().nonempty(),
});
export type AllInclusiveProduct = z.infer<typeof allInclusiveProduct>;

export const allInclusiveBarcode = z.object({
  barcode: z.string().nonempty(),
});
export type AllInclusiveBarcode = z.infer<typeof allInclusiveBarcode>;
