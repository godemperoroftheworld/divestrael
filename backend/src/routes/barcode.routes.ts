import { FastifyPluginCallback } from 'fastify';

import barcodeController from '@/controllers/barcode.controller';
import { barcodeGetParams, barcodeResponse } from '@/schemas/barcode.schema';

const barcodeRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.get(
    '/:barcode',
    {
      schema: { params: barcodeGetParams, response: { 200: barcodeResponse } },
    },
    barcodeController.getBarcodeHandler,
  );
};

export default barcodeRoutes;
