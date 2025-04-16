import { z } from 'zod';

import { BrandWithRelationsSchema, BrandPartialWithRelationsSchema } from './BrandSchema';
import type { BrandWithRelations, BrandPartialWithRelations } from './BrandSchema';
import { BarcodeWithRelationsSchema, BarcodePartialWithRelationsSchema } from './BarcodeSchema';
import type { BarcodeWithRelations, BarcodePartialWithRelations } from './BarcodeSchema';

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brandId: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

/////////////////////////////////////////
// PRODUCT PARTIAL SCHEMA
/////////////////////////////////////////

export const ProductPartialSchema = ProductSchema.partial();

export type ProductPartial = z.infer<typeof ProductPartialSchema>;

/////////////////////////////////////////
// PRODUCT RELATION SCHEMA
/////////////////////////////////////////

export type ProductRelations = {
  brand: BrandWithRelations;
  barcode: BarcodeWithRelations[];
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations;

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(
  z.object({
    brand: z.lazy(() => BrandWithRelationsSchema),
    barcode: z.lazy(() => BarcodeWithRelationsSchema).array(),
  }),
);

/////////////////////////////////////////
// PRODUCT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ProductPartialRelations = {
  brand?: BrandPartialWithRelations;
  barcode?: BarcodePartialWithRelations[];
};

export type ProductPartialWithRelations = z.infer<typeof ProductPartialSchema> &
  ProductPartialRelations;

export const ProductPartialWithRelationsSchema: z.ZodType<ProductPartialWithRelations> =
  ProductPartialSchema.merge(
    z.object({
      brand: z.lazy(() => BrandPartialWithRelationsSchema),
      barcode: z.lazy(() => BarcodePartialWithRelationsSchema).array(),
    }),
  ).partial();

export type ProductWithPartialRelations = z.infer<typeof ProductSchema> & ProductPartialRelations;

export const ProductWithPartialRelationsSchema: z.ZodType<ProductWithPartialRelations> =
  ProductSchema.merge(
    z
      .object({
        brand: z.lazy(() => BrandPartialWithRelationsSchema),
        barcode: z.lazy(() => BarcodePartialWithRelationsSchema).array(),
      })
      .partial(),
  );

export default ProductSchema;
