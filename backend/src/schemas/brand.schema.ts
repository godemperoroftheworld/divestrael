import z from 'zod';

import { companyResponse } from '@/schemas/company.schema';

export const brandResponse = z.object({
  name: z.string(),
  company: companyResponse.optional(),
});
export type BrandResponse = z.infer<typeof brandResponse>;

export const brandQuery = z.object({
  name: z.string().nonempty(),
});
export type BrandQuery = z.infer<typeof brandQuery>;

export const brandBody = z.object({
  name: z.string().nonempty(),
  companyId: z.string().nonempty(),
});
export type BrandBody = z.infer<typeof brandBody>;
