import { z } from 'zod';

export const CompanyScalarFieldEnumSchema = z.enum([
  'id',
  'cw_id',
  'name',
  'description',
  'country',
  'url',
  'reasons',
  'source',
]);

export default CompanyScalarFieldEnumSchema;
