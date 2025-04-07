import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import {
  AllInclusiveProduct,
  AllInclusiveCompany,
  AllInclusiveBarcode,
} from '@/schemas/allinclusive.schema';
import CompanyService from '@/services/company.service';
import companyMapper from '@/controllers/mappers/company.mapper';
import { CompanyResponse } from '@/schemas/company.schema';
import { BarcodeResponse } from '@/schemas/barcode.schema';
import barcodeMapper from '@/controllers/mappers/barcode.mapper';
import BarcodeService from '@/services/barcode.service';
import ProductService from '@/services/product.service';
import { ProductResponse } from '@/schemas/product.schema';
import productMapper from '@/controllers/mappers/product.mapper';

export const postCompany: RouteHandler<{
  Body: AllInclusiveCompany;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const { country, name } = req.body;
  const result = await CompanyService.instance.getOrCreateByName(name, country);
  const response = companyMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const postBarcode: RouteHandler<{
  Body: AllInclusiveBarcode;
  Reply: { 200: BarcodeResponse };
}> = async (req, res) => {
  const { barcode } = req.body;
  const result = await BarcodeService.instance.getOrCreateByCode(barcode);
  const response = barcodeMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export const postProduct: RouteHandler<{
  Body: AllInclusiveProduct;
  Reply: { 200: ProductResponse };
}> = async (req, res) => {
  const { name, brand: brandName } = req.body;
  const result = await ProductService.instance.getOrCreateByName(name, brandName);
  const response = productMapper(result);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postBarcode,
  postProduct,
  postCompany,
};
