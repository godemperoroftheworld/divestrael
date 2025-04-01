import { FastifyPluginCallback } from 'fastify';

import companyController from '@/controllers/company.controller';
import { companyGetParams, companyPostBody, companyResponse } from '@/schemas/company.schema';

const companyRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: { body: companyPostBody, response: { 200: companyResponse } },
    },
    companyController.postCompanyHandler,
  );
  fastify.get(
    '/:id',
    {
      schema: { params: companyGetParams, response: { 200: companyResponse } },
    },
    companyController.getCompanyHandler,
  );
};

export default companyRoutes;
