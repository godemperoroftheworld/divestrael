import { FastifyRequestType } from 'fastify/types/type-provider';
import { HttpStatusCode } from 'axios';
import { RouteHandlerMethod } from 'fastify';

import BarcodeService from '@/services/barcode.service';
import AIService from '@/services/ai.service';
import CompanyService from '@/services/company.service';

export interface BarcodeGet extends FastifyRequestType {
  params: {
    barcode: string;
  };
}

const getBarcodeHandler: RouteHandlerMethod = async (req, res) => {
  const { barcode } = (req as BarcodeGet).params;
  const product = await BarcodeService.instance.getBarcode(barcode);
  const { name } = await AIService.instance.getCompany(product.title, product.brand);
  const parentCompany = await CompanyService.instance.findTopCompany(name);
  res.status(HttpStatusCode.Ok).send(parentCompany);
};

export default {
  getBarcodeHandler,
};
