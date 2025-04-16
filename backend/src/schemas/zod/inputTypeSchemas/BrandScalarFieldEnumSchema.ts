import { z } from 'zod';

export const BrandScalarFieldEnumSchema = z.enum(['id', 'name', 'companyId']);

export default BrandScalarFieldEnumSchema;
