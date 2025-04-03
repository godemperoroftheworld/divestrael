import { HttpStatusCode } from 'axios';

import BarcodeService from '@/services/barcode.service';
import { BarcodeBody, BarcodeResponse } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';
import { GetParams, SearchQuery } from '@/schemas';
import barcodeMapper from '@/mappers/barcode.mapper';

const postBarcodeHandler: RouteHandler<{
  Body: BarcodeBody;
  Reply: { 200: BarcodeResponse };
}> = async (req, res) => {
  const barcodeBody = req.body;
  const barcode = await BarcodeService.instance.createBarcode(barcodeBody);
  const response = barcodeMapper(barcode);
  res.status(HttpStatusCode.Ok).send(response);
};

const getBarcodeHandler: RouteHandler<{
  Params: GetParams;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { id } = req.params;
  const barcode = await BarcodeService.instance.getBarcode(id);
  const response = barcodeMapper(barcode);
  res.status(HttpStatusCode.Ok).send(response);
};

const searchBarcodeHandler: RouteHandler<{
  Querystring: SearchQuery;
  Reply: BarcodeResponse | null;
}> = async (req, res) => {
  const { query } = req.query;
  const barcode = await BarcodeService.instance.searchBarcode(query);
  if (barcode) {
    const response = barcodeMapper(barcode);
    res.status(HttpStatusCode.Ok).send(response);
  } else {
    res.status(HttpStatusCode.Ok).send(null);
  }
};

export default {
  postBarcodeHandler,
  getBarcodeHandler,
  searchBarcodeHandler,
};
