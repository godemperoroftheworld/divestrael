import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { barcodeBody, barcodeParams, barcodeResponse } from '@/schemas/barcode.schema';
import barcodeController from '@/controllers/barcode.controller';

const barcodeRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/:code',
    {
      schema: { params: barcodeParams, body: barcodeBody, response: { 200: barcodeResponse } },
    },
    barcodeController.postBarcode,
  );
  server.get(
    '/:code',
    {
      schema: { params: barcodeParams, body: barcodeBody, response: { 200: barcodeResponse } },
    },
    barcodeController.getBarcode,
  );
  server.put(
    '/:code',
    {
      schema: {
        params: barcodeParams,
        body: barcodeBody.required(),
        response: { 200: barcodeResponse },
      },
    },
    barcodeController.putBarcode,
  );
};

export default barcodeRoutes;
