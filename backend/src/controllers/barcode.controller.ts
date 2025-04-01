import { HttpStatusCode } from 'axios';

import BarcodeService, { BarcodeWithData } from '@/services/barcode.service';
import { BarcodeBody, BarcodeParams, BarcodeResponse } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';

function mapBarcodeResponse(data: BarcodeWithData): BarcodeResponse {
  const { name: title, brand: productBrand } = data.product;
  const { name: brand, company: brandCompany } = productBrand;
  const { name: company, image, reasons, source } = brandCompany;
  return {
    barcode: data.code,
    title,
    brand,
    company,
    reasons,
    boycott: !!reasons.length,
    image: image ?? undefined,
    source: source ?? undefined,
  };
}

const getBarcodeHandler: RouteHandler<{
  Params: BarcodeParams;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { barcode } = req.params;
  const result = await BarcodeService.instance.getBarcode(barcode);
  res.status(HttpStatusCode.Ok).send(mapBarcodeResponse(result));
};

const putBarcodeHandler: RouteHandler<{
  Params: BarcodeParams;
  Body: BarcodeBody;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { barcode } = req.params;
  const { title, brand } = req.body;
  const result = await BarcodeService.instance.updateBarcode(
    barcode,
    { name: title },
    { name: brand },
  );
  res.status(HttpStatusCode.Ok).send(mapBarcodeResponse(result));
};

export default {
  getBarcodeHandler,
  putBarcodeHandler,
};
