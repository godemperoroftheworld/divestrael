import { HttpStatusCode } from 'axios';

import { BarcodeBody, BarcodeParams, BarcodeResponse } from '@/schemas/barcode.schema';
import BarcodeService from '@/services/barcode.service';
import barcodeMapper from '@/controllers/mappers/barcode.mapper';
import { RouteHandler } from '@/helpers/types.helper';

export const postBarcode: RouteHandler<{
  Params: BarcodeParams;
  Body: BarcodeBody;
  Reply: { 200: BarcodeResponse };
}> = async (req, res) => {
  const { code } = req.params;
  const { productId } = req.body;
  const barcode = await BarcodeService.instance.getOrCreateByCode(code, productId);
  const response = barcodeMapper(barcode);
  res.status(HttpStatusCode.Ok).send(response);
};

export const getBarcode: RouteHandler<{
  Params: BarcodeParams;
  Reply: { 200: BarcodeResponse | null };
}> = async (req, res) => {
  const { code } = req.params;
  const barcode = await BarcodeService.instance.searchOne(code);
  const response = barcode ? barcodeMapper(barcode) : null;
  res.status(HttpStatusCode.Ok).send(response);
};

export const putBarcode: RouteHandler<{
  Params: BarcodeParams;
  Body: Required<BarcodeBody>;
  Reply: { 200: BarcodeResponse };
}> = async (req, res) => {
  const { code } = req.params;
  const { productId } = req.body;
  const barcode = await BarcodeService.instance.updateOneByProperty('code', code, { productId });
  const response = barcodeMapper(barcode);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postBarcode,
  getBarcode,
  putBarcode,
};
