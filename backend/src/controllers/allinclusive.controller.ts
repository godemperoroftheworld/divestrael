import { HttpStatusCode } from 'axios';

import { AllInclusiveProduct, AllInclusiveCompany } from '@/schemas/allinclusive.schema';
import { RouteHandler } from '@/helpers/types.helper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import ProductPipeline, { ProductQuery } from '@/resolver/product.resolver';
import CompanyResolverPipeline from '@/resolver/company.resolver';

export const postCompany: RouteHandler<{
  Body: AllInclusiveCompany;
  Reply: { 200: PrismaModelExpanded<'Company'> };
}> = async (req, res) => {
  const query = req.body;
  const result = await CompanyResolverPipeline.resolve(query);
  res.status(HttpStatusCode.Ok).send(result);
};

export const postProduct: RouteHandler<{
  Body: AllInclusiveProduct;
  Reply: { 200: PrismaModelExpanded<'Product'> };
}> = async (req, res) => {
  const query: ProductQuery =
    'image' in req.body
      ? { image: req.body.image }
      : { name: req.body.name, brand: req.body.brand };
  const result = await ProductPipeline.resolve(query);
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  postProduct,
  postCompany,
};
