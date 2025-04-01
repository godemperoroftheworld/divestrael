import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { CompanyGetParams, CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import { ERRORS } from '@/helpers/errors.helper';
import CompanyService, { CompanyWithBrands } from '@/services/company.service';

function mapCompanyResponse(company: CompanyWithBrands): CompanyResponse {
  const { name, description, image, source, reasons, brands, country } = company;
  return {
    name,
    description,
    brands: brands.map((brand) => brand.name),
    image: image ?? undefined,
    reasons: reasons ?? undefined,
    source: source ?? undefined,
    country,
  };
}

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const company = req.body;
  const result = await CompanyService.instance.createCompany(company);
  res.status(HttpStatusCode.Ok).send(mapCompanyResponse(result));
};

const postCompaniesHandler: RouteHandler<{
  Body: CompanyPostBody[];
  Reply: CompanyResponse[];
}> = async (req, res) => {
  const companies = req.body;
  const promises: Promise<CompanyWithBrands | null>[] = [];
  companies.forEach((company, index) => {
    const promise = new Promise<CompanyWithBrands | null>((resolve, reject) => {
      setTimeout(() => {
        CompanyService.instance
          .createCompany(company)
          .then(resolve)
          .catch((err) => {
            if (err === ERRORS.companyExists) {
              resolve(null);
            } else {
              setTimeout(() => {
                CompanyService.instance.createCompany(company).then(resolve).catch(reject);
              }, 2000);
            }
          });
      }, 250 * index);
    });
    promises.push(promise);
  });
  const response: CompanyResponse[] = (await Promise.all(promises))
    .filter((v) => !!v)
    .map((v) => mapCompanyResponse(v));
  res.status(HttpStatusCode.Ok).send(response);
};

const getCompanyHandler: RouteHandler<{
  Params: CompanyGetParams;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const { id } = req.params;
  const result = await CompanyService.instance.getCompany(id);
  res.status(HttpStatusCode.Ok).send(mapCompanyResponse(result));
};

export default {
  postCompanyHandler,
  postCompaniesHandler,
  getCompanyHandler,
};
