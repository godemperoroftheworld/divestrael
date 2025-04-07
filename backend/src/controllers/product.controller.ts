import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { ProductBody, ProductResponse } from '@/schemas/product.schema';
import ProductService from '@/services/product.service';
import productMapper from '@/mappers/product.mapper';
import { IdParams, SearchQuery } from '@/schemas';

export const postProduct: RouteHandler<{
  Body: ProductBody;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const { name, brandId } = req.body;
  const result = await ProductService.instance.createOne({ name, brandId });
  const response = productMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const getProduct: RouteHandler<{
  Params: IdParams;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.instance.getOne(id);
  const response = productMapper(product);
  res.status(HttpStatusCode.Ok).send(response);
};

export const updateProduct: RouteHandler<{
  Params: IdParams;
  Body: ProductBody;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const { name, brandId } = req.body;
  const result = await ProductService.instance.updateOne(id, {
    name,
    brandId,
  });
  const response = productMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const searchProduct: RouteHandler<{
  Querystring: SearchQuery;
  Reply: { 200: ProductResponse[] };
}> = async (req, res) => {
  const { query } = req.query;
  const result = await ProductService.instance.searchMany(query);
  const response = result.map(productMapper);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postProduct,
  getProduct,
  updateProduct,
  searchProduct,
};
