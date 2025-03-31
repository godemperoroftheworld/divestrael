import { HttpStatusCode } from 'axios';

import BarcodeService from '@/services/barcode.service';
import AIService from '@/services/ai.service';
import CompanyService, { Company } from '@/services/company.service';
import { BarcodeGetParams } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';

const getBarcodeHandler: RouteHandler<{ Params: BarcodeGetParams; Reply: Company | null }> = async (
  req,
  res,
) => {
  const { barcode } = req.params;
  const product = await BarcodeService.instance.getBarcode(barcode);
  const { name } = await AIService.instance.getCompany(product.title, product.brand);
  const parentCompany = await CompanyService.instance.findTopCompany(name);
  res.status(HttpStatusCode.Ok).send(parentCompany);
};

export default {
  getBarcodeHandler,
};
