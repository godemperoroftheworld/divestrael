import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import loadConfig from '@/config/env.config';
import { handleServerError } from '@/helpers/errors.helper';
import routes from '@/routes';
import { initDMMF } from '@/prisma';

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);
let server: FastifyInstance;

function startServer() {
  server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });

  // Type provider
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  // Swagger
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Divestrael API',
        description: 'Boycott, Divestment and Sanction API',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });
  server.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
  });

  // Register middlewares
  server.register(cors);
  server.register(helmet);

  // Set Routes
  server.register(routes, { prefix: '/api' });

  // Set error handler
  server.setErrorHandler((error: Error, _request, reply) => {
    server.log.error(error);
    handleServerError(reply, error);
  });

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  // Start server
  server.listen({ port, host }).catch((err) => {
    server.log.error(err);
    process.exit(1);
  });
}

initDMMF().then(startServer);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  server.log.error('Unhandled Rejection', err);
  process.exit(1);
});
