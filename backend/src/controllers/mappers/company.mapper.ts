import { Company } from '@prisma/client';
import { Brand } from '.prisma/client';

import { CompanyWithBrands } from '@/services/company.service';
import { CompanyResponse } from '@/schemas/company.schema';

function brandMapper(company: Company | CompanyWithBrands): CompanyResponse {
  const { name, description, image, source, reasons, country } = company;
  let brands: Brand[] | undefined = undefined;
  if ('brands' in company) {
    brands = company.brands;
  }
  return {
    name,
    description,
    brands: brands?.map((brand) => brand.name),
    image: image ?? undefined,
    reasons: reasons ?? undefined,
    source: source ?? undefined,
    country,
  };
}

export default brandMapper;
