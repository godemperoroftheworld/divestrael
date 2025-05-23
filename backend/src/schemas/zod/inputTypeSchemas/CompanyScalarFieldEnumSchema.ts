import { z } from 'zod';

export const CompanyScalarFieldEnumSchema = z.enum([
  'id',
  'cik',
  'cw_id',
  'name',
  'description',
  'country',
  'url',
  'reasons',
  'source',
]);

export default CompanyScalarFieldEnumSchema;
