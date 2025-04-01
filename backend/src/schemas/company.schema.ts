import z from 'zod';
import { BoycottReason, Country } from '@prisma/client';

// REPLY
export const companyResponse = z.object({
  name: z.string(),
  description: z.string(),
  brands: z.array(z.string()),
  image: z.string().optional(),
  reasons: z.array(z.nativeEnum(BoycottReason)),
  country: z.nativeEnum(Country),
  source: z.string().optional(),
});
export type CompanyResponse = z.infer<typeof companyResponse>;

// POST
export const companyPostBody = companyResponse
  .omit({
    brands: true,
    image: true,
    description: true,
    country: true,
  })
  .merge(
    z.object({
      country: z.nativeEnum(Country).optional(),
    }),
  );
export type CompanyPostBody = z.infer<typeof companyPostBody>;

// GET
export const companyGetParams = z.object({
  id: z.string().nonempty(),
});
export type CompanyGetParams = z.infer<typeof companyGetParams>;
