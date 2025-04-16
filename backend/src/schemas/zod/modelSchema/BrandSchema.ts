import { z } from 'zod';

import { ProductWithRelationsSchema, ProductPartialWithRelationsSchema } from './ProductSchema';
import type { ProductWithRelations, ProductPartialWithRelations } from './ProductSchema';
import { CompanyWithRelationsSchema, CompanyPartialWithRelationsSchema } from './CompanySchema';
import type { CompanyWithRelations, CompanyPartialWithRelations } from './CompanySchema';

/////////////////////////////////////////
// BRAND SCHEMA
/////////////////////////////////////////

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
});

export type Brand = z.infer<typeof BrandSchema>;

/////////////////////////////////////////
// BRAND PARTIAL SCHEMA
/////////////////////////////////////////

export const BrandPartialSchema = BrandSchema.partial();

export type BrandPartial = z.infer<typeof BrandPartialSchema>;

/////////////////////////////////////////
// BRAND RELATION SCHEMA
/////////////////////////////////////////

export type BrandRelations = {
  products: ProductWithRelations[];
  company: CompanyWithRelations;
};

export type BrandWithRelations = z.infer<typeof BrandSchema> & BrandRelations;

export const BrandWithRelationsSchema: z.ZodType<BrandWithRelations> = BrandSchema.merge(
  z.object({
    products: z.lazy(() => ProductWithRelationsSchema).array(),
    company: z.lazy(() => CompanyWithRelationsSchema),
  }),
);

/////////////////////////////////////////
// BRAND PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type BrandPartialRelations = {
  products?: ProductPartialWithRelations[];
  company?: CompanyPartialWithRelations;
};

export type BrandPartialWithRelations = z.infer<typeof BrandPartialSchema> & BrandPartialRelations;

export const BrandPartialWithRelationsSchema: z.ZodType<BrandPartialWithRelations> =
  BrandPartialSchema.merge(
    z.object({
      products: z.lazy(() => ProductPartialWithRelationsSchema).array(),
      company: z.lazy(() => CompanyPartialWithRelationsSchema),
    }),
  ).partial();

export type BrandWithPartialRelations = z.infer<typeof BrandSchema> & BrandPartialRelations;

export const BrandWithPartialRelationsSchema: z.ZodType<BrandWithPartialRelations> =
  BrandSchema.merge(
    z
      .object({
        products: z.lazy(() => ProductPartialWithRelationsSchema).array(),
        company: z.lazy(() => CompanyPartialWithRelationsSchema),
      })
      .partial(),
  );

export default BrandSchema;
