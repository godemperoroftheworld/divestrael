import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

import schemas from '@/schemas';
import loadConfig from '@/config/env.config';
import { ERRORS } from '@/helpers/errors.helper';
import routes from '@/routes';

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

  // Register middlewares
  server.register(cors);
  server.register(helmet);

  // Set Routes
  server.register(routes, { prefix: '/api' });

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);

    return reply
      .status(ERRORS.internalServerError.statusCode)
      .send(ERRORS.internalServerError.message);
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

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  server.log.error('Unhandled Rejection', err);
  process.exit(1);
});
