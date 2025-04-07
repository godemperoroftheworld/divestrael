import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import allInclusiveRoutes from '@/routes/allinclusive.route';
import barcodeRoutes from '@/routes/barcode.route';
import productRoutes from '@/routes/product.route';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  fastify.register(allInclusiveRoutes, { prefix: '/allinclusive' });
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
  fastify.register(productRoutes, { prefix: '/product' });
};

export default routes;
