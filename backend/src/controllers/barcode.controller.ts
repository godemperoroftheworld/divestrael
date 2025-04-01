import { HttpStatusCode } from 'axios';

import BarcodeService from '@/services/barcode.service';
import AIService from '@/services/ai.service';
import CorpwatchService from '@/services/corpwatch.service';
import { BarcodeGetParams, BarcodeResponse } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';
import KGService from '@/services/knowledgegraph.service';

const getBarcodeHandler: RouteHandler<{
  Params: BarcodeGetParams;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { barcode } = req.params;
  const product = await BarcodeService.instance.getBarcode(barcode);
  const { name } = await AIService.instance.getCompany(product.title, product.brand);
  const parentCompany = await CorpwatchService.instance.findTopCompany(name);

  const company = parentCompany?.company_name ?? name;
  const image = await KGService.instance.getImage(company);
  res.status(HttpStatusCode.Ok).send({
    barcode,
    title: product.title,
    brand: product.brand,
    company: parentCompany?.company_name ?? name,
    image,
  });
};

export default {
  getBarcodeHandler,
};
