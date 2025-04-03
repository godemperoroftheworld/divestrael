import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import CompanyService from '@/services/company.service';
import companyMapper from '@/mappers/company.mapper';
import { GetParams, SearchQuery } from '@/schemas';

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const companyBody = req.body;
  const company = await CompanyService.instance.createCompany(companyBody);
  const response = companyMapper(company);
  res.status(HttpStatusCode.Ok).send(response);
};

const searchCompanyHandler: RouteHandler<{
  Params: SearchQuery;
  Reply: { 200: CompanyResponse | null };
}> = async (req, res) => {
  const { query } = req.params;
  const company = await CompanyService.instance.searchCompany(query);
  if (company) {
    const response = companyMapper(company);
    res.status(HttpStatusCode.Ok).send(response);
  } else {
    res.status(HttpStatusCode.Ok).send(null);
  }
};

const getCompanyHandler: RouteHandler<{
  Params: GetParams;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const company = await CompanyService.instance.getCompany(id);
  const response = companyMapper(company);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postCompanyHandler,
  getCompanyHandler,
  searchCompanyHandler,
};
