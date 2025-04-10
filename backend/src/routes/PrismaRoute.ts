import z from 'zod';
import { FastifyInstance, RouteHandlerMethod } from 'fastify';

import { PrismaModel, PrismaModelName, PrismaModelProperty } from '@/helpers/prisma.helper';
import PrismaController from '@/controllers/PrismaController';
import { idParams, prismaBody, searchQuery } from '@/schemas';

export default class PrismaRoute<
  N extends PrismaModelName,
  P extends PrismaModelProperty,
  M extends PrismaModel<N> = PrismaModel<N>,
  Req extends z.AnyZodObject = z.AnyZodObject,
  Res extends z.AnyZodObject = z.AnyZodObject,
> {
  protected constructor(
    protected readonly controller: PrismaController<N, P, z.infer<Res>, M>,
    private readonly requestSchema: Req,
    private readonly responseSchema: Res,
  ) {}

  public register(fastify: FastifyInstance) {
    fastify.register(async (server) => {
      server.post(
        '/',
        {
          schema: {
            body: prismaBody,
            response: { 200: z.array(this.responseSchema) },
          },
        },
        this.controller.getAll as RouteHandlerMethod,
      );
      server.post(
        '/:id',
        {
          schema: {
            params: idParams,
            body: this.requestSchema,
            response: { 200: this.responseSchema },
          },
        },
        this.controller.post as RouteHandlerMethod,
      );
      server.put(
        '/:id',
        {
          schema: {
            params: idParams,
            body: this.requestSchema.partial(),
            response: { 200: this.responseSchema },
          },
        },
        this.controller.put as RouteHandlerMethod,
      );
      server.get(
        '/:id',
        {
          schema: {
            params: idParams,
            response: { 200: this.responseSchema },
          },
        },
        this.controller.get as RouteHandlerMethod,
      );
      server.get(
        '/search',
        {
          schema: {
            query: searchQuery,
            response: { 200: z.array(this.responseSchema) },
          },
        },
        this.controller.search as RouteHandlerMethod,
      );
    });
  }
}
