import { HttpStatusCode } from 'axios';

import {
  AllInclusiveProduct,
  AllInclusiveCompany,
  AllInclusiveBarcode,
} from '@/schemas/allinclusive.schema';
import CompanyService from '@/services/company.service';
import BarcodeService from '@/services/barcode.service';
import ProductService from '@/services/product.service';
import { RouteHandler } from '@/helpers/types.helper';
import { PrismaModelExpanded } from '@/helpers/prisma.helper';

export const postCompany: RouteHandler<{
  Body: AllInclusiveCompany;
  Reply: { 200: PrismaModelExpanded<'Company'> };
}> = async (req, res) => {
  const { country, name } = req.body;
  const result = await CompanyService.instance.getOrCreateByName(name, country);
  res.status(HttpStatusCode.Ok).send(result);
};

export const postBarcode: RouteHandler<{
  Body: AllInclusiveBarcode;
  Reply: { 200: PrismaModelExpanded<'Barcode'> };
}> = async (req, res) => {
  const { barcode } = req.body;
  const result = await BarcodeService.instance.getOrCreateByCode(barcode);
  res.status(HttpStatusCode.Ok).send(result);
};

export const postProduct: RouteHandler<{
  Body: AllInclusiveProduct;
  Reply: { 200: PrismaModelExpanded<'Product'> };
}> = async (req, res) => {
  const { name, brand: brandName } = req.body;
  const result = await ProductService.instance.getOrCreateByName(name, brandName);
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  postBarcode,
  postProduct,
  postCompany,
};
