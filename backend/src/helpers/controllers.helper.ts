import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { handleServerError } from '@/helpers/errors.helper';

type ControllerMethod = (req: FastifyRequest, res: FastifyReply) => void;

export default function fastifyController(controller: ControllerMethod): RouteHandlerMethod {
  return (req, res) => {
    try {
      return controller(req, res);
    } catch (err) {
      handleServerError(res, err as Error);
    }
  };
}
