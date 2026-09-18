import { z } from 'zod';

export const CompanyAliasScalarFieldEnumSchema = z.enum(['id', 'name', 'companyId']);

export default CompanyAliasScalarFieldEnumSchema;
