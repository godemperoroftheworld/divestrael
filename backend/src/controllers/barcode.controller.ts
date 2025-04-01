import { HttpStatusCode } from 'axios';

import BarcodeService from '@/services/barcode.service';
import { BarcodeGetParams, BarcodeResponse } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';

const getBarcodeHandler: RouteHandler<{
  Params: BarcodeGetParams;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { barcode } = req.params;
  // Get barcode information
  const result = await BarcodeService.instance.getBarcode(barcode);
  const { name: title, brand: productBrand } = result.product;
  const { name: brand, company: brandCompany } = productBrand;
  const { name: company, image, reasons, source } = brandCompany;
  res.status(HttpStatusCode.Ok).send({
    barcode,
    title,
    brand,
    company,
    reasons,
    boycott: !!reasons.length,
    image: image ?? undefined,
    source: source ?? undefined,
  });
};

export default {
  getBarcodeHandler,
};
