import { Prisma, PrismaClient } from '@prisma/client';
import { GetFindResult } from '@prisma/client/runtime/library';
import { fromPairs } from 'lodash';

import prisma from '@/prisma';

type PrismaModelName = keyof Prisma.TypeMap['model'];
type PrismaModelProperty = Prisma.TypeMap['meta']['modelProps'];
type PrismaModel<T extends PrismaModelName> = GetFindResult<
  Prisma.TypeMap['model'][T]['payload'],
  object,
  object
>;
interface BaseArgs {
  select?: unknown;
  omit?: unknown;
  include?: unknown;
  where: unknown;
}
interface CreateArgs<T> {
  data: T;
  include?: unknown;
}
interface UpdateArgs<T> extends CreateArgs<T> {
  where: unknown;
}

interface PrismaModelBase<T> {
  findUnique: (args: BaseArgs) => Promise<T | null>;
  findUniqueOrThrow: (args: BaseArgs) => Promise<T>;
  findMany: (args: BaseArgs) => Promise<T[]>;
  create: (args: CreateArgs<unknown>) => Promise<T>;
  createMany: (args: CreateArgs<unknown[]>) => Promise<{ count: number }>;
  aggregateRaw: (args: {
    pipeline?: Prisma.InputJsonValue[];
    options?: Prisma.InputJsonValue;
  }) => Promise<Prisma.JsonObject>;
  update: (args: UpdateArgs<unknown>) => Promise<T>;
}

export default abstract class PrismaService<
  N extends PrismaModelName,
  P extends PrismaModelProperty,
  M = PrismaModel<N>,
> {
  protected readonly repository: PrismaClient[P];

  protected constructor(private property: P) {
    this.repository = prisma[property];
  }

  protected abstract baseIncludes(): object;

  protected abstract searchPaths(): string[];

  protected abstract lookup(): object | undefined;

  protected abstract fields(): string[];

  private get repositoryBase() {
    return this.repository as unknown as PrismaModelBase<M>;
  }

  public async getOne(id: string): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { id },
      include: this.baseIncludes(),
    });
  }

  public async getOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { [property]: value },
      include: this.baseIncludes(),
    });
  }

  public async hasOne(id: number): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  public async hasOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { [property]: value },
      select: { id: true },
    });
    return !!result;
  }

  public async searchOne(query: string, fuzzy?: boolean): Promise<M | null> {
    return ((
      await this.repository.aggregateRaw({
        pipeline: [
          {
            $search: {
              index: 'search',
              text: {
                query,
                path: this.searchPaths(),
                fuzzy: fuzzy ? {} : undefined,
              },
            },
          },
          {
            $limit: 1,
          },
          this.lookup()
            ? {
                $lookup: this.lookup(),
              }
            : {},
          {
            $project: {
              _id: false,
              id: { $toString: '_id' },
              ...fromPairs(this.fields().map((f) => [f, true])),
            },
          },
        ],
      })
    )[0] ?? null) as M | null;
  }

  public async searchMany(query: string, fuzzy?: boolean): Promise<M[]> {
    return (await this.repository.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: 'search',
            text: {
              query,
              path: this.searchPaths(),
              fuzzy: fuzzy ? {} : undefined,
            },
          },
        },
        this.lookup()
          ? {
              $lookup: {
                from: this.property,
                ...this.lookup(),
              },
            }
          : {},
        {
          $project: {
            _id: false,
            id: { $toString: '_id' },
            ...fromPairs(this.fields().map((f) => [f, true])),
          },
        },
      ],
    })) as unknown as M[];
  }

  public async createOne(data: Omit<PrismaModel<N>, 'id'>): Promise<M> {
    return this.repositoryBase.create({
      data,
      include: this.baseIncludes(),
    });
  }

  public async createMany(data: Omit<PrismaModel<N>, 'id'>[]): Promise<M[]> {
    await this.repositoryBase.createMany({
      data,
    });
    const searchPath = this.searchPaths()[0] as keyof Omit<PrismaModel<N>, 'id'>;
    return this.repositoryBase.findMany({
      where: {
        [searchPath]: { in: data.map((d) => d[searchPath]) },
      },
    });
  }

  public async updateOne(id: string, data: Partial<Omit<PrismaModel<N>, 'id'>>): Promise<M> {
    return this.repositoryBase.update({
      where: { id },
      data,
      include: this.baseIncludes(),
    });
  }

  public async updateOneByProperty<K extends keyof PrismaModel<N>>(
    key: K,
    value: PrismaModel<N>[K],
    data: Partial<Omit<PrismaModel<N>, 'id'>>,
  ) {
    return this.repositoryBase.update({
      where: { key: value },
      data,
      include: this.baseIncludes(),
    });
  }
}
