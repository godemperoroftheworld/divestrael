import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import process from 'node:process';

import allInclusiveRoutes from '@/routes/allinclusive.route';
import ProductRoutes from '@/routes/product.route';
import BrandRoute from '@/routes/brand.route';
import CompanyRoute from '@/routes/company.route';
import KeyService from '@/services/key.service';
import { ERRORS } from '@/helpers/errors.helper';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  // API Keys
  if (process.env.NODE_ENV === 'production') {
    fastify.addHook('onRequest', async (req: FastifyRequest) => {
      // Get known keys
      const knownKeys = await KeyService.keys();
      // Get passed in key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || typeof apiKey !== 'string' || !knownKeys.has(apiKey)) {
        throw ERRORS.apiKey;
      }
    });
  }

  fastify.register(allInclusiveRoutes, { prefix: '/allinclusive' });
  ProductRoutes.instance.register(fastify);
  BrandRoute.instance.register(fastify);
  CompanyRoute.instance.register(fastify);
};

export default routes;
