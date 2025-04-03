import z from 'zod';
import { Country } from '@prisma/client';

export const allInclusiveCompany = z.object({
  name: z.string().nonempty(),
  country: z.nativeEnum(Country),
});
export type AllInclusiveCompany = z.infer<typeof allInclusiveCompany>;

export const allInclusiveBarcode = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  brand: z.string().nonempty(),
});
export type AllInclusiveBarcode = z.infer<typeof allInclusiveBarcode>;
