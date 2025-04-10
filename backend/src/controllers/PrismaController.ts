import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { HttpStatusCode } from 'axios';

import PrismaService, { PrismaServiceParams } from '@/services/PrismaService';
import { PrismaModel, PrismaModelName, PrismaModelProperty } from '@/helpers/prisma.helper';
import { IdParams, SearchQuery } from '@/schemas';

export default abstract class PrismaController<
  N extends PrismaModelName,
  P extends PrismaModelProperty,
  S extends z.infer<z.Schema>,
  M extends PrismaModel<N> = PrismaModel<N>,
> {
  protected abstract mapData(data: M): S;

  protected constructor(protected readonly service: PrismaService<N, P, M>) {}

  public async post(req: FastifyRequest, res: FastifyReply) {
    const data = req.body as PrismaModel<N>;
    const result = await this.service.createOne(data);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  }

  public async put(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as IdParams;
    const data = req.body as Partial<PrismaModel<N>>;
    const result = await this.service.updateOne(id, data);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  }

  public async get(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as IdParams;
    const result = await this.service.getOne(id);
    const response = this.mapData(result);
    res.status(HttpStatusCode.Ok).send(response);
  }

  // Get with POST
  public async getAll(req: FastifyRequest, res: FastifyReply) {
    const params = req.body as PrismaServiceParams<N>;
    const result = await this.service.getMany(params);
    const response = result.map(this.mapData);
    res.status(HttpStatusCode.Ok).send(response);
  }

  public async search(req: FastifyRequest, res: FastifyReply) {
    const { query } = req.params as SearchQuery;
    const result = await this.service.searchMany(query);
    const response = result.map(this.mapData);
    res.status(HttpStatusCode.Ok).send(response);
  }
}
