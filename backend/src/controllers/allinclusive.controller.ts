import { HttpStatusCode } from 'axios';

import { AllInclusiveProduct, AllInclusiveCompany } from '@/schemas/allinclusive.schema';
import ProductService from '@/services/product.service';
import { RouteHandler } from '@/helpers/types.helper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import AIService from '@/services/generator.service';
import { ERRORS } from '@/helpers/errors.helper';
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
  let name, brand: string;
  if ('image' in req.body) {
    // Generating from image
    const { image } = req.body;
    const product = await AIService.instance.generateProduct(image);
    name = product.name;
    brand = product.brand;
  } else {
    // Generating from name, brand
    name = req.body.name;
    brand = req.body.brand;
  }
  if (!name || !brand) {
    throw ERRORS.noProductFound;
  }
  const result = await ProductService.instance.getOrCreateByName(name, brand);
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  postProduct,
  postCompany,
};
