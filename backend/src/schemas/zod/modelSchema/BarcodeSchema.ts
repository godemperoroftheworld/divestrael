import { z } from 'zod';

import { ProductWithRelationsSchema, ProductPartialWithRelationsSchema } from './ProductSchema';
import type { ProductWithRelations, ProductPartialWithRelations } from './ProductSchema';

/////////////////////////////////////////
// BARCODE SCHEMA
/////////////////////////////////////////

export const BarcodeSchema = z.object({
  id: z.string(),
  code: z.string(),
  productId: z.string(),
});

export type Barcode = z.infer<typeof BarcodeSchema>;

/////////////////////////////////////////
// BARCODE PARTIAL SCHEMA
/////////////////////////////////////////

export const BarcodePartialSchema = BarcodeSchema.partial();

export type BarcodePartial = z.infer<typeof BarcodePartialSchema>;

/////////////////////////////////////////
// BARCODE RELATION SCHEMA
/////////////////////////////////////////

export type BarcodeRelations = {
  product: ProductWithRelations;
};

export type BarcodeWithRelations = z.infer<typeof BarcodeSchema> & BarcodeRelations;

export const BarcodeWithRelationsSchema: z.ZodType<BarcodeWithRelations> = BarcodeSchema.merge(
  z.object({
    product: z.lazy(() => ProductWithRelationsSchema),
  }),
);

/////////////////////////////////////////
// BARCODE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type BarcodePartialRelations = {
  product?: ProductPartialWithRelations;
};

export type BarcodePartialWithRelations = z.infer<typeof BarcodePartialSchema> &
  BarcodePartialRelations;

export const BarcodePartialWithRelationsSchema: z.ZodType<BarcodePartialWithRelations> =
  BarcodePartialSchema.merge(
    z.object({
      product: z.lazy(() => ProductPartialWithRelationsSchema),
    }),
  ).partial();

export type BarcodeWithPartialRelations = z.infer<typeof BarcodeSchema> & BarcodePartialRelations;

export const BarcodeWithPartialRelationsSchema: z.ZodType<BarcodeWithPartialRelations> =
  BarcodeSchema.merge(
    z
      .object({
        product: z.lazy(() => ProductPartialWithRelationsSchema),
      })
      .partial(),
  );

export default BarcodeSchema;
