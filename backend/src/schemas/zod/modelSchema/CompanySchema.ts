import { z } from 'zod';

import { CountrySchema } from '../inputTypeSchemas/CountrySchema';
import { BoycottReasonSchema } from '../inputTypeSchemas/BoycottReasonSchema';
import { BrandWithRelationsSchema, BrandPartialWithRelationsSchema } from './BrandSchema';
import type { BrandWithRelations, BrandPartialWithRelations } from './BrandSchema';

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const CompanySchema = z.object({
  country: CountrySchema,
  reasons: BoycottReasonSchema.array(),
  id: z.string(),
  cik: z.number().int().nullable(),
  cw_id: z.string().nullable(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  source: z.string().nullable(),
});

export type Company = z.infer<typeof CompanySchema>;

/////////////////////////////////////////
// COMPANY PARTIAL SCHEMA
/////////////////////////////////////////

export const CompanyPartialSchema = CompanySchema.partial();

export type CompanyPartial = z.infer<typeof CompanyPartialSchema>;

/////////////////////////////////////////
// COMPANY RELATION SCHEMA
/////////////////////////////////////////

export type CompanyRelations = {
  brands: BrandWithRelations[];
};

export type CompanyWithRelations = z.infer<typeof CompanySchema> & CompanyRelations;

export const CompanyWithRelationsSchema: z.ZodType<CompanyWithRelations> = CompanySchema.merge(
  z.object({
    brands: z.lazy(() => BrandWithRelationsSchema).array(),
  }),
);

/////////////////////////////////////////
// COMPANY PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type CompanyPartialRelations = {
  brands?: BrandPartialWithRelations[];
};

export type CompanyPartialWithRelations = z.infer<typeof CompanyPartialSchema> &
  CompanyPartialRelations;

export const CompanyPartialWithRelationsSchema: z.ZodType<CompanyPartialWithRelations> =
  CompanyPartialSchema.merge(
    z.object({
      brands: z.lazy(() => BrandPartialWithRelationsSchema).array(),
    }),
  ).partial();

export type CompanyWithPartialRelations = z.infer<typeof CompanySchema> & CompanyPartialRelations;

export const CompanyWithPartialRelationsSchema: z.ZodType<CompanyWithPartialRelations> =
  CompanySchema.merge(
    z
      .object({
        brands: z.lazy(() => BrandPartialWithRelationsSchema).array(),
      })
      .partial(),
  );

export default CompanySchema;
