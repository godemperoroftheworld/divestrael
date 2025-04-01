import z from 'zod';

export const companyResponse = z.object({
  name: z.string(),
  description: z.string(),
  brands: z.array(z.string()),
  boycott: z.boolean(),
  image: z.string().optional(),
  reason: z.string().optional(),
  source: z.string().optional(),
});
export type CompanyResponse = z.infer<typeof companyResponse>;

export const companyPostBody = companyResponse.omit({ brands: true, image: true });
export type CompanyPostBody = z.infer<typeof companyPostBody>;
