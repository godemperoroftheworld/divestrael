import { Brand } from '.prisma/client';

import { BrandWithCompany } from '@/services/brand.service';
import companyMapper from '@/controllers/mappers/company.mapper';
import { BrandResponse } from '@/schemas/brand.schema';

function brandMapper(brand: BrandWithCompany | Brand): BrandResponse {
  const { name } = brand;
  let company = undefined;
  if ('company' in brand) {
    company = brand.company;
  }
  return {
    name,
    company: company ? companyMapper(company) : undefined,
  };
}

export default brandMapper;
