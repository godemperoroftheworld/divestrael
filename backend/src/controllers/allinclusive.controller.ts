import { HttpStatusCode } from 'axios';

import { AllInclusiveProduct, AllInclusiveCompany } from '@/schemas/allinclusive.schema';
import CompanyService from '@/services/company.service';
import ProductService from '@/services/product.service';
import { RouteHandler } from '@/helpers/types.helper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';
import AIService from '@/services/generator.service';
import { ERRORS } from '@/helpers/errors.helper';

export const postCompany: RouteHandler<{
  Body: AllInclusiveCompany;
  Reply: { 200: PrismaModelExpanded<'Company'> };
}> = async (req, res) => {
  const { country, name } = req.body;
  const result = await CompanyService.instance.getOrCreateByName(name, country);
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
  if (!name || name === 'N/A') {
    throw ERRORS.noProductFound;
  }
  const result = await ProductService.instance.getOrCreateByName(name, brand);
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  postProduct,
  postCompany,
};
