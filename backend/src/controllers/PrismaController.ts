import z from 'zod';
import { HttpStatusCode } from 'axios';

import PrismaService, { PrismaServiceParams } from '@/services/PrismaService';
import { PrismaModel, PrismaModelExpanded, PrismaModelName } from '@/helpers/prisma.helper';
import { IdParams, SearchQuery } from '@/schemas';
import { RouteHandler } from '@/helpers/types.helper';

export default abstract class PrismaController<
  N extends PrismaModelName,
  S extends z.infer<z.Schema>,
> {
  protected abstract mapData(data: PrismaModelExpanded<N>): S;

  protected constructor(protected readonly service: PrismaService<N>) {}

  // If these are methods, `this` returns as undefined for some reason when called from fastify.

  public readonly post: RouteHandler<{
    Body: PrismaModel<N>;
  }> = async (req, res) => {
    const data = req.body as PrismaModel<N>;
    const result = await this.service.createOne(data);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  };

  public readonly put: RouteHandler<{
    Params: IdParams;
    Body: Partial<PrismaModel<N>>;
  }> = async (req, res) => {
    const { id } = req.params as IdParams;
    const data = req.body as Partial<PrismaModel<N>>;
    const result = await this.service.updateOne(id, data);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  };

  public readonly get: RouteHandler<{
    Params: IdParams;
  }> = async (req, res) => {
    const { id } = req.params as IdParams;
    const result = await this.service.getOne(id);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  };

  // Get with POST
  public readonly getAll: RouteHandler<{
    Body: PrismaServiceParams<N>;
  }> = async (req, res) => {
    const params = req.body as PrismaServiceParams<N>;
    const result = await this.service.getMany(params);
    const response = result.map(this.mapData);
    res.status(HttpStatusCode.Ok).send(response);
  };

  public readonly search: RouteHandler<{
    Querystring: SearchQuery;
  }> = async (req, res) => {
    const { query } = req.query as SearchQuery;
    const result = await this.service.searchMany(query);
    const response = result.map(this.mapData);
    res.status(HttpStatusCode.Ok).send(response);
  };
}
