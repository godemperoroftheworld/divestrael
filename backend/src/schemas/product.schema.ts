import z from 'zod';

import { brandResponse } from '@/schemas/brand.schema';

export const productBody = z.object({
  name: z.string().nonempty(),
  brandId: z.string().nonempty(),
});

export const productResponse = z.object({
  title: z.string(),
  brand: brandResponse.optional(),
});
export type ProductResponse = z.infer<typeof productResponse>;
