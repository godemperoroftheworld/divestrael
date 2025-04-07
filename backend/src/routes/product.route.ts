import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { productBody, productResponse } from '@/schemas/product.schema';
import productController from '@/controllers/product.controller';
import { idParams, searchQuery } from '@/schemas';

const productRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/',
    {
      schema: {
        body: productBody,
        response: { 200: productResponse },
      },
    },
    productController.postProduct,
  );
  server.get(
    '/:id',
    {
      schema: {
        params: idParams,
        response: { 200: productResponse },
      },
    },
    productController.getProduct,
  );
  server.put(
    '/:id',
    {
      schema: {
        params: idParams,
        body: productBody.partial(),
        response: { 200: productResponse },
      },
    },
    productController.updateProduct,
  );
  server.get(
    '/search',
    {
      schema: {
        query: searchQuery,
        response: { 200: z.array(productResponse) },
      },
    },
    productController.searchProduct,
  );
};

export default productRoutes;
