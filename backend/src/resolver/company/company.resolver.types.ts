import { Country } from '@prisma/client';

import { Resolver } from '@/resolver/resolver';
import { Company } from '@/schemas/zod';

export interface CompanyQuery {
  id?: string;
  name?: string;
  brand?: string;
  product?: string;
  country?: Country;
}

export abstract class CompanyResolver extends Resolver<CompanyQuery, Company> {}
