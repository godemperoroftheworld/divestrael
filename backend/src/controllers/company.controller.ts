import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { IdParams, SearchQuery } from '@/schemas';
import CompanyService from '@/services/company.service';
import companyMapper from '@/controllers/mappers/company.mapper';
import { CompanyPostBody, CompanyPutBody, CompanyResponse } from '@/schemas/company.schema';
import CorpwatchService from '@/services/corpwatch.service';

export const postCompany: RouteHandler<{
  Body: CompanyPostBody;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const data = req.body;
  const corpwatch = await CorpwatchService.instance.findTopCompany(data.name);
  const result = await CompanyService.instance.createOne({
    ...data,
    image: data.image ?? null,
    source: data.source ?? null,
    cik: corpwatch?.cik ?? null,
    cw_id: corpwatch?.cw_id ?? null,
  });
  const response = companyMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const getCompany: RouteHandler<{
  Params: IdParams;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const product = await CompanyService.instance.getOne(id);
  const response = companyMapper(product);
  res.status(HttpStatusCode.Ok).send(response);
};

export const updateCompany: RouteHandler<{
  Params: IdParams;
  Body: CompanyPutBody;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CompanyService.instance.updateOne(id, data);
  const response = companyMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const searchCompany: RouteHandler<{
  Querystring: SearchQuery;
  Reply: { 200: CompanyResponse[] };
}> = async (req, res) => {
  const { query } = req.query;
  const result = await CompanyService.instance.searchMany(query);
  const response = result.map(companyMapper);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postCompany,
  getCompany,
  updateCompany,
  searchCompany,
};
