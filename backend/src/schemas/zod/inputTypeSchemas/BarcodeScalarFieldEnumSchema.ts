import { z } from 'zod';

export const BarcodeScalarFieldEnumSchema = z.enum(['id', 'code', 'productId']);

export default BarcodeScalarFieldEnumSchema;
