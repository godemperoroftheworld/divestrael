import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { idParams, searchQuery } from '@/schemas';
import brandController from '@/controllers/brand.controller';
import { companyPostBody, companyPutBody, companyResponse } from '@/schemas/company.schema';
import companyController from '@/controllers/company.controller';

const companyRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/',
    {
      schema: {
        body: companyPostBody,
        response: { 200: companyResponse },
      },
    },
    companyController.postCompany,
  );
  server.get(
    '/:id',
    {
      schema: {
        params: idParams,
        response: { 200: companyResponse },
      },
    },
    companyController.getCompany,
  );
  server.put(
    '/:id',
    {
      schema: {
        params: idParams,
        body: companyPutBody,
        response: { 200: companyResponse },
      },
    },
    companyController.updateCompany,
  );
  server.get(
    '/search',
    {
      schema: {
        query: searchQuery,
        response: { 200: z.array(companyResponse) },
      },
    },
    companyController.searchCompany,
  );
};

export default companyRoutes;
