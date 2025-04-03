import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { ProductBody, ProductResponse } from '@/schemas/product.schema';
import ProductService from '@/services/product.service';
import productMapper from '@/mappers/product.mapper';
import { GetParams, SearchQuery } from '@/schemas';

const postProductHandler: RouteHandler<{
  Body: ProductBody;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const productBody = req.body;
  const product = await ProductService.instance.createProduct(productBody);
  const response = productMapper(product);
  res.status(HttpStatusCode.Ok).send(response);
};

const getProductHandler: RouteHandler<{
  Params: GetParams;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.instance.getProduct(id);
  const response = productMapper(product);
  res.status(HttpStatusCode.Ok).send(response);
};

const searchProductHandler: RouteHandler<{
  Querystring: SearchQuery;
  Reply: { 200: ProductResponse | null };
}> = async (req, res) => {
  const { query } = req.query;
  const product = await ProductService.instance.searchProduct(query);
  if (product) {
    const response = productMapper(product);
    res.status(HttpStatusCode.Ok).send(response);
  } else {
    res.status(HttpStatusCode.Ok).send(null);
  }
};

export default {
  postProductHandler,
  getProductHandler,
  searchProductHandler,
};
