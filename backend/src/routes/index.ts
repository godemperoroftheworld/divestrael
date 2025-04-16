import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import allInclusiveRoutes from '@/routes/allinclusive.route';
import barcodeRoutes from '@/routes/barcode.route';
import ProductRoutes from '@/routes/product.route';
import BrandRoute from '@/routes/brand.route';
import CompanyRoute from '@/routes/company.route';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  fastify.register(allInclusiveRoutes, { prefix: '/allinclusive' });
  fastify.register(barcodeRoutes, { prefix: '/barcode' });
  ProductRoutes.instance.register(fastify);
  BrandRoute.instance.register(fastify);
  CompanyRoute.instance.register(fastify);
};

export default routes;
