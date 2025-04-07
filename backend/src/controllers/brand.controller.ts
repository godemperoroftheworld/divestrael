import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { IdParams, SearchQuery } from '@/schemas';
import { BrandBody, BrandResponse } from '@/schemas/brand.schema';
import BrandService from '@/services/brand.service';
import brandMapper from '@/mappers/brand.mapper';

export const postBrand: RouteHandler<{
  Body: BrandBody;
  Reply: { 200: BrandResponse };
}> = async (req, res) => {
  const { name, companyId } = req.body;
  const result = await BrandService.instance.createOne({ name, companyId });
  const response = brandMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const getBrand: RouteHandler<{
  Params: IdParams;
  Reply: { 200: BrandResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const product = await BrandService.instance.getOne(id);
  const response = brandMapper(product);
  res.status(HttpStatusCode.Ok).send(response);
};

export const updateBrand: RouteHandler<{
  Params: IdParams;
  Body: Partial<BrandBody>;
  Reply: { 200: BrandResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const { name, companyId } = req.body;
  const result = await BrandService.instance.updateOne(id, {
    name,
    companyId,
  });
  const response = brandMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const searchBrand: RouteHandler<{
  Querystring: SearchQuery;
  Reply: { 200: BrandResponse[] };
}> = async (req, res) => {
  const { query } = req.query;
  const result = await BrandService.instance.searchMany(query);
  const response = result.map(brandMapper);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postBrand,
  getBrand,
  updateBrand,
  searchBrand,
};
