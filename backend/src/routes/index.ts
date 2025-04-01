import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import barcodeRoutes from '@/routes/barcode.routes';
import companyRoutes from '@/routes/company.routes';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
  fastify.register(companyRoutes, { prefix: '/company ' });
};

export default routes;
