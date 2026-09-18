import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { HttpStatusCode } from 'axios';

const healthCheckRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/', {}, (_, reply) => reply.status(HttpStatusCode.Ok).send());
};

export default healthCheckRoute;
