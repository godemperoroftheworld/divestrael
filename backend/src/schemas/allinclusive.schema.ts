import z from 'zod';
import { Country } from '@prisma/client';

export const allInclusiveCompany = z.object({
  name: z.string().nonempty(),
  country: z.nativeEnum(Country),
});
export type AllInclusiveCompany = z.infer<typeof allInclusiveCompany>;

export const allInclusiveProduct = z.union([
  z.object({
    name: z.string().nonempty(),
    brand: z.string().nonempty(),
  }),
  z.object({
    image: z.string().refine(
      (val) => {
        return /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=\s]+$/.test(val);
      },
      { message: 'Invalid base64 image string' },
    ),
  }),
]);
export type AllInclusiveProduct = z.infer<typeof allInclusiveProduct>;

export const allInclusiveBarcode = z.object({
  barcode: z.string().nonempty(),
});
export type AllInclusiveBarcode = z.infer<typeof allInclusiveBarcode>;
