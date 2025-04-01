import { FastifyPluginCallback } from 'fastify';

import barcodeController from '@/controllers/barcode.controller';
import { barcodeBody, barcodeParams, barcodeResponse } from '@/schemas/barcode.schema';

const barcodeRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.get(
    '/:barcode',
    {
      schema: { params: barcodeParams, response: { 200: barcodeResponse } },
    },
    barcodeController.getBarcodeHandler,
  );
  fastify.put(
    '/:barcode',
    {
      schema: { params: barcodeParams, body: barcodeBody, response: { 200: barcodeResponse } },
    },
    barcodeController.putBarcodeHandler,
  );
};

export default barcodeRoutes;
