import { FastifyPluginAsync } from 'fastify';

import barcodeRoutes from '@/routes/barcode.routes';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
};

export default routes;
