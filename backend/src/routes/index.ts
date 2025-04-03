import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const routes: FastifyPluginAsync = async (server) => {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
};

export default routes;
