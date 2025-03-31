import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

export type RouteHandler<T extends RouteGenericInterface> = (
  req: FastifyRequest<T>,
  res: FastifyReply<T>,
) => Promise<void>;
