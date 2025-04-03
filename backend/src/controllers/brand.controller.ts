import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { BrandBody, BrandResponse } from '@/schemas/brand.schema';
import BrandService from '@/services/brand.service';
import brandMapper from '@/mappers/brand.mapper';
import { GetParams, SearchQuery } from '@/schemas';

const postBrandHandler: RouteHandler<{
  Body: BrandBody;
  Reply: { 200: BrandResponse };
}> = async (req, res) => {
  const brandBody = req.body;
  const brand = await BrandService.instance.searchOrCreateBrand(brandBody);
  const response = brandMapper(brand);
  res.status(HttpStatusCode.Ok).send(response);
};

const getBrandHandler: RouteHandler<{
  Params: GetParams;
  Reply: { 200: BrandResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const brand = await BrandService.instance.getBrand(id);
  const response = brandMapper(brand);
  res.status(HttpStatusCode.Ok).send(response);
};

const searchBrandHandler: RouteHandler<{
  Querystring: SearchQuery;
  Reply: { 200: BrandResponse | null };
}> = async (req, res) => {
  const { query } = req.query;
  const brand = await BrandService.instance.searchBrand(query);
  if (brand) {
    const response = brandMapper(brand);
    res.status(HttpStatusCode.Ok).send(response);
  } else {
    res.status(HttpStatusCode.Ok).send(null);
  }
};

export default {
  postBrandHandler,
  getBrandHandler,
  searchBrandHandler,
};
