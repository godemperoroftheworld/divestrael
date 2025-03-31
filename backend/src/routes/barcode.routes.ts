import { FastifyInstance, FastifyPluginCallback } from 'fastify';

import barcodeController from '@/controllers/barcode.controller';
import { barcodeGetParams, barcodeResponse } from '@/schemas/barcode.schema';

const barcodeRoutes: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  fastify.get(
    '/:barcode',
    {
      schema: {
        params: barcodeGetParams,
        body: barcodeResponse,
      },
    },
    barcodeController.getBarcodeHandler,
  );
  fastify.withTypeProvider();
};

export default barcodeRoutes;
