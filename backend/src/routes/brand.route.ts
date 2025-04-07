import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { idParams, searchQuery } from '@/schemas';
import brandController from '@/controllers/brand.controller';
import { brandBody, brandResponse } from '@/schemas/brand.schema';

const brandRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/',
    {
      schema: {
        body: brandBody,
        response: { 200: brandResponse },
      },
    },
    brandController.postBrand,
  );
  server.get(
    '/:id',
    {
      schema: {
        params: idParams,
        response: { 200: brandResponse },
      },
    },
    brandController.getBrand,
  );
  server.put(
    '/:id',
    {
      schema: {
        params: idParams,
        body: brandBody.partial(),
        response: { 200: brandResponse },
      },
    },
    brandController.updateBrand,
  );
  server.get(
    '/search',
    {
      schema: {
        query: searchQuery,
        response: { 200: z.array(brandResponse) },
      },
    },
    brandController.searchBrand,
  );
};

export default brandRoutes;
