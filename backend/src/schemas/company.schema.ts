import z from 'zod';
import { BoycottReason, Country } from '@prisma/client';

// REPLY
export const companyResponse = z.object({
  name: z.string(),
  description: z.string(),
  brands: z.array(z.string()).optional(),
  image: z.string().optional(),
  reasons: z.array(z.nativeEnum(BoycottReason)),
  country: z.nativeEnum(Country),
  source: z.string().optional(),
});
export type CompanyResponse = z.infer<typeof companyResponse>;

// POST
export const companyBody = companyResponse.omit({
  brands: true,
});
export type CompanyBody = z.infer<typeof companyBody>;

// GET
export const companyGetParams = z.object({
  id: z.string().nonempty(),
});
export type CompanyGetParams = z.infer<typeof companyGetParams>;
