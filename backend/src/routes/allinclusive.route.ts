import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import {
  allInclusiveProduct,
  allInclusiveCompany,
  allInclusiveBarcode,
} from '@/schemas/allinclusive.schema';
import allinclusiveController from '@/controllers/allinclusive.controller';
import {
  BarcodePartialWithRelationsSchema,
  CompanyPartialWithRelationsSchema,
  ProductPartialWithRelationsSchema,
} from '@/schemas/zod';

const allInclusiveRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/barcode',
    {
      schema: {
        tags: ['allinclusive'],
        body: allInclusiveBarcode,
        response: { 200: BarcodePartialWithRelationsSchema },
      },
    },
    allinclusiveController.postBarcode,
  );
  server.post(
    '/product',
    {
      schema: {
        tags: ['allinclusive'],
        body: allInclusiveProduct,
        response: { 200: ProductPartialWithRelationsSchema },
      },
    },
    allinclusiveController.postProduct,
  );
  server.post(
    '/company',
    {
      schema: {
        tags: ['allinclusive'],
        body: allInclusiveCompany,
        response: { 200: CompanyPartialWithRelationsSchema },
      },
    },
    allinclusiveController.postCompany,
  );
};

export default allInclusiveRoutes;
