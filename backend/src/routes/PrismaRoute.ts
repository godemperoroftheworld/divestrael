import z from 'zod';
import { FastifyInstance, RouteHandlerMethod } from 'fastify';

import { PrismaModel, PrismaModelName } from '@/helpers/prisma.helper';
import PrismaController from '@/controllers/PrismaController';
import { idParams, prismaBody, searchQuery } from '@/schemas';

type FixedPrismaModel<N extends PrismaModelName> = Partial<PrismaModel<N>> & z.ZodRawShape;

export default class PrismaRoute<
  N extends PrismaModelName,
  M extends PrismaModel<N> = PrismaModel<N>,
  Req extends z.ZodObject<FixedPrismaModel<N>> = z.ZodObject<FixedPrismaModel<N>>,
  Res extends z.AnyZodObject = z.AnyZodObject,
> {
  protected constructor(
    public readonly prefix: Lowercase<N>,
    protected readonly controller: PrismaController<N, z.infer<Res>, M>,
    private readonly requestSchema: z.input<Req>,
    private readonly responseSchema: Res,
  ) {}

  public register(fastify: FastifyInstance) {
    fastify.register(
      async (server) => {
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
      },
      { prefix: `/${this.prefix}` },
    );
  }
}
