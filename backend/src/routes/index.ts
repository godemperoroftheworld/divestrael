import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import barcodeRoutes from '@/routes/barcode.routes';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
};

export default routes;
