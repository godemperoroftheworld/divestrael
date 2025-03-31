import { FastifyPluginCallback } from 'fastify';

import barcodeRoutes from '@/routes/barcode.routes';

const routes: FastifyPluginCallback = (fastify) => {
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
};

export default routes;
