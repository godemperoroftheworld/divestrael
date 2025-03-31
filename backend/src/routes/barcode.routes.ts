import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import Joi from 'joi';

import barcodeController from '@/controllers/barcode.controller';

const barcodeRoutes: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get(
    '/:barcode',
    {
      schema: {
        params: Joi.object({ barcode: Joi.string().required() }),
      },
    },
    barcodeController.postBarcodeHandler,
  );
};

export default barcodeRoutes;
