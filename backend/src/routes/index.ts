import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import allInclusiveRoutes from '@/routes/allinclusive.route';
import ProductRoutes from '@/routes/product.route';
import BrandRoute from '@/routes/brand.route';
import CompanyRoute from '@/routes/company.route';
import BarcodeRoute from '@/routes/barcode.route';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  fastify.register(allInclusiveRoutes, { prefix: '/allinclusive' });
  BarcodeRoute.instance.register(fastify);
  ProductRoutes.instance.register(fastify);
  BrandRoute.instance.register(fastify);
  CompanyRoute.instance.register(fastify);
};

export default routes;
