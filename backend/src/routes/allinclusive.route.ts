import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import {
  allInclusiveProduct,
  allInclusiveCompany,
  allInclusiveBarcode,
} from '@/schemas/allinclusive.schema';
import allinclusiveController from '@/controllers/allinclusive.controller';
import { companyResponse } from '@/schemas/company.schema';
import { productResponse } from '@/schemas/product.schema';
import { barcodeResponse } from '@/schemas/barcode.schema';

const allinclusiveRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/barcode',
    {
      schema: { body: allInclusiveBarcode, response: { 200: barcodeResponse } },
    },
    allinclusiveController.postBarcode,
  );
  server.post(
    '/product',
    {
      schema: {
        body: allInclusiveProduct,
        response: { 200: productResponse },
      },
    },
    allinclusiveController.postProduct,
  );
  server.post(
    '/company',
    {
      schema: {
        body: allInclusiveCompany,
        response: { 200: companyResponse },
      },
    },
    allinclusiveController.postCompany,
  );
};

export default allinclusiveRoutes;
