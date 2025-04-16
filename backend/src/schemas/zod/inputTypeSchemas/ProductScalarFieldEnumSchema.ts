import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'name', 'brandId']);

export default ProductScalarFieldEnumSchema;
