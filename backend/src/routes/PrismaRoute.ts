import z from 'zod';
import { FastifyInstance, RouteHandlerMethod } from 'fastify';
import prismaFQP from '@krsbx/prisma-fqp';

import {
  PrismaFilter,
  PrismaModel,
  PrismaModelExpanded,
  PrismaModelName,
} from '@/helpers/prisma.helper';
import PrismaController from '@/controllers/PrismaController';
import { idParams, prismaBody, searchQuery } from '@/schemas';
import { DeepPartial } from '@/helpers/types.helper';

type FixedPrismaModel<N extends PrismaModelName> = Partial<PrismaModel<N>> & z.ZodRawShape;

export default class PrismaRoute<
  N extends PrismaModelName,
  Req extends z.ZodObject<FixedPrismaModel<N>> = z.ZodObject<FixedPrismaModel<N>>,
  Res extends z.ZodType<DeepPartial<PrismaModelExpanded<N>>> = z.ZodType<
    DeepPartial<PrismaModelExpanded<N>>
  >,
> {
  protected constructor(
    public readonly prefix: Lowercase<N>,
    protected readonly controller: PrismaController<N>,
    private readonly requestSchema: z.input<Req>,
    private readonly responseSchema: Res,
  ) {}

  protected routes(server: FastifyInstance) {
    server.post(
      '/getAll',
      {
        schema: {
          body: prismaBody.nullable().optional(),
          response: { 200: z.array(this.responseSchema) },
        },
      },
      this.controller.getAll as RouteHandlerMethod,
    );
    server.post(
      '/',
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
          querystring: prismaBody.nullable().optional(),
          response: { 200: this.responseSchema },
        },
      },
      this.controller.get as RouteHandlerMethod,
    );
    server.get(
      '/search',
      {
        schema: {
          querystring: searchQuery.merge(prismaBody),
          response: { 200: this.responseSchema },
        },
      },
      this.controller.search as RouteHandlerMethod,
    );
  }

  public register(fastify: FastifyInstance) {
    fastify.register(
      async (server) => {
        this.routes(server);
      },
      { prefix: `/${this.prefix}` },
    );
  }
}
