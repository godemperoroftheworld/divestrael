import z from 'zod';
import { BoycottReason } from '@prisma/client';

import { brandResponse } from '@/schemas/brand.schema';

export const productQuery = z.object({
  name: z.string().nonempty(),
});
export type ProductQuery = z.infer<typeof productQuery>;

export const productBody = z.object({
  name: z.string().nonempty(),
  brandId: z.string().nonempty(),
});
export type ProductBody = z.infer<typeof productBody>;

export const productResponse = z.object({
  title: z.string(),
  brand: brandResponse.optional(),
});
export type ProductResponse = z.infer<typeof productResponse>;
