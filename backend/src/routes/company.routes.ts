import { FastifyPluginCallback } from 'fastify';

import companyController from '@/controllers/company.controller';
import { companyPostBody, companyResponse } from '@/schemas/company.schema';

const companyRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: { body: companyPostBody, response: { 200: companyResponse } },
    },
    companyController.postCompanyHandler,
  );
};

export default companyRoutes;
