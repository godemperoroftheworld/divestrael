import { HttpStatusCode } from 'axios';

import PrismaService, { PrismaServiceParams } from '@/services/PrismaService';
import { PrismaModel, PrismaModelName } from '@/helpers/prisma.helper';
import { IdParams, SearchQuery } from '@/schemas';
import { RouteHandler } from '@/helpers/types.helper';

export default abstract class PrismaController<N extends PrismaModelName> {
  protected constructor(protected readonly service: PrismaService<N>) {}

  // If these are methods, `this` returns as undefined for some reason when called from fastify.

  public readonly post: RouteHandler<{
    Body: PrismaModel<N>;
  }> = async (req, res) => {
    const data = req.body as PrismaModel<N>;
    const result = await this.service.createOne(data);
    res.status(HttpStatusCode.Ok).send(result);
  };

  public readonly put: RouteHandler<{
    Params: IdParams;
    Body: Partial<PrismaModel<N>>;
  }> = async (req, res) => {
    const { id } = req.params as IdParams;
    const data = req.body as Partial<PrismaModel<N>>;
    const result = await this.service.updateOne(id, data);
    res.status(HttpStatusCode.Ok).send(result);
  };

  public readonly get: RouteHandler<{
    Params: IdParams;
  }> = async (req, res) => {
    const { id } = req.params as IdParams;
    const result = await this.service.getOne(id);
    res.status(HttpStatusCode.Ok).send(result);
  };

  // Get with POST
  public readonly getAll: RouteHandler<{
    Body: PrismaServiceParams<N>;
  }> = async (req, res) => {
    const params = req.body as PrismaServiceParams<N>;
    const result = await this.service.getMany(params);
    res.status(HttpStatusCode.Ok).send(result);
  };

  public readonly search: RouteHandler<{
    Querystring: SearchQuery;
  }> = async (req, res) => {
    const { query } = req.query as SearchQuery;
    const result = await this.service.searchMany(query);
    res.status(HttpStatusCode.Ok).send(result);
  };
}
