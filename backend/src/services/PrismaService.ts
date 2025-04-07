import { Prisma, PrismaClient } from '@prisma/client';
import { fromPairs } from 'lodash';
import { GetFindResult } from '@prisma/client/runtime/library';

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
}

// TODO FIX TYPES
export default abstract class PrismaService<
  N extends PrismaModelName,
  P extends PrismaModelProperty,
  M = PrismaModel<N>,
> {
  protected readonly repository: PrismaClient[P];

  protected constructor(private model: P) {
    this.repository = prisma[model];
  }

  protected static baseIncludes() {
    return {};
  }

  protected static searchPaths(): string[] {
    return ['name'];
  }

  protected static lookup(): object | undefined {
    return undefined;
  }

  private fields() {
    return fromPairs(
      Object.keys(this.repository.fields).map(([key]) => [
        key,
        key === 'id' ? { $toString: '$_id' } : 1,
      ]),
    );
  }

  private get repositoryBase() {
    return this.repository as unknown as PrismaModelBase<M>;
  }

  public async getOne(id: string): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { id },
      include: PrismaService.baseIncludes(),
    });
  }

  public async getOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { [property]: value },
      include: PrismaService.baseIncludes(),
    });
  }

  public async hasOne(id: number): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { id },
    });
    return !!result;
  }

  public async hasOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { [property]: value },
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
                path: PrismaService.searchPaths(),
                fuzzy: fuzzy ? {} : undefined,
              },
            },
          },
          {
            $limit: 1,
          },
          PrismaService.lookup()
            ? {
                $lookup: PrismaService.lookup(),
              }
            : {},
          {
            $project: this.fields(),
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
              path: PrismaService.searchPaths(),
              fuzzy: fuzzy ? {} : undefined,
            },
          },
        },
        PrismaService.lookup()
          ? {
              $lookup: {
                from: this.model,
                ...PrismaService.lookup(),
              },
            }
          : {},
        {
          $project: this.fields(),
        },
      ],
    })) as unknown as M[];
  }

  public async createOne(data: Omit<PrismaModel<N>, 'id'>): Promise<M> {
    return this.repositoryBase.create({
      data,
      include: PrismaService.baseIncludes(),
    });
  }

  public async createMany(data: Omit<PrismaModel<N>, 'id'>[]): Promise<M[]> {
    await this.repositoryBase.createMany({
      data,
    });
    const searchPath = PrismaService.searchPaths()[0] as keyof Omit<PrismaModel<N>, 'id'>;
    return this.repositoryBase.findMany({
      where: {
        [searchPath]: { in: data.map((d) => d[searchPath]) },
      },
    });
  }
}
