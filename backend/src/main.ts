import fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import formBody from '@fastify/formbody';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

import jsonSchema from '@/schemas/json-schema.json';
import loadConfig from '@/config/env.config';
import { AppError, ERRORS } from '@/helpers/errors.helper';

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);
let server: FastifyInstance;

const startServer = async () => {
  server = fastify({
    logger: pino({ level: process.env.LOG_LEVEL }),
  });

  // Register middlewares
  server.register(formBody);
  server.register(cors);
  server.register(helmet);

  // Set validation schema
  server.addSchema(jsonSchema);

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

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
  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  server.log.error('Unhandled Rejection', err);
  process.exit(1);
});

await startServer();
