import { Prisma, PrismaClient } from '@prisma/client';
import { fromPairs, merge } from 'lodash';

import prisma from '@/prisma';
import { DeepKey } from '@/helpers/types.helper';
import { PrismaModel, PrismaModelName } from '@/helpers/prisma.helper';

// Args
type PrismaOperations<N extends PrismaModelName> = Prisma.TypeMap['model'][N]['operations'];
type PrismaArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['findUnique']['args']>;
type PrismaCreateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['create']['args']>;
type PrismaUpdateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['update']['args']>;

// Filters
type PrismaFilters<N extends PrismaModelName> = PrismaArgs<N>['where'];
type PrismaSelect<N extends PrismaModelName> = PrismaArgs<N>['select'];
type PrismaInclude<N extends PrismaModelName> = PrismaArgs<N>['include'];
type PrismaOmit<N extends PrismaModelName> = PrismaArgs<N>['omit'];
export interface PrismaServiceParams<N extends PrismaModelName> {
  select?: DeepKey<PrismaModel<N>>[];
  filter?: PrismaFilters<N>;
  include?: PrismaInclude<N>;
  omit?: PrismaOmit<N>;
}

// Prisma repository
interface PrismaRepositoryBase<N extends PrismaModelName, T extends PrismaModel<N>> {
  findUnique: (args: PrismaArgs<N>) => Promise<T | null>;
  findUniqueOrThrow: (args: PrismaArgs<N>) => Promise<T>;
  findMany: (args: PrismaArgs<N>) => Promise<T[]>;
  create: (args: PrismaCreateArgs<N>) => Promise<T>;
  createMany: (args: PrismaCreateArgs<N>) => Promise<{ count: number }>;
  aggregateRaw: (args: {
    pipeline?: Prisma.InputJsonValue[];
    options?: Prisma.InputJsonValue;
  }) => Promise<Prisma.JsonObject>;
  update: (args: PrismaUpdateArgs<N>) => Promise<T>;
}

export default abstract class PrismaService<
  N extends PrismaModelName,
  M extends PrismaModel<N> = PrismaModel<N>,
> {
  private static buildSelects<N extends PrismaModelName>(
    selects: DeepKey<PrismaModel<N>>[],
  ): Prisma.TypeMap['model'][N]['operations']['findUnique']['args']['where'] {
    return merge(
      selects.map((select) => {
        const splitSelect = select.split('.');
        const selectObject: Record<string, object> = {};
        return splitSelect.reduce((result, val) => {
          result[val] = {};
          return result;
        }, selectObject);
      }),
    );
  }

  protected readonly repository: PrismaClient[Lowercase<N>];
  protected constructor(private property: Lowercase<N>) {
    this.repository = prisma[property];
  }

  protected abstract baseIncludes(): PrismaInclude<N>;

  protected abstract searchPaths(): string[];

  protected abstract lookup(): object | undefined;

  protected abstract fields(): (keyof M)[];

  private get repositoryBase() {
    return this.repository as unknown as PrismaRepositoryBase<N, M>;
  }

  public async getOne(id: string): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { id },
      include: this.baseIncludes(),
    } as PrismaArgs<N>);
  }

  public async getOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<M> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { [property]: value } as unknown as PrismaFilters<N>,
      include: this.baseIncludes(),
    } as PrismaArgs<N>);
  }

  public async getMany(params: PrismaServiceParams<N>): Promise<M[]> {
    const { select, filter, include, omit } = params;
    return this.repositoryBase.findMany({
      select: select ? PrismaService.buildSelects(select) : undefined,
      where: filter,
      include,
      omit,
    } as PrismaArgs<N>);
  }

  public async hasOne(id: string): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { id } as PrismaFilters<N>,
      select: { id: true },
    } as PrismaArgs<N>);
    return !!result;
  }

  public async hasOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<boolean> {
    const result = await this.repositoryBase.findUnique({
      where: { [property]: value } as unknown as PrismaFilters<N>,
      select: { id: true } as PrismaSelect<N>,
    } as PrismaArgs<N>);
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

  public async searchMany(
    query: string,
    include: PrismaInclude<N> = {},
    fuzzy?: boolean,
  ): Promise<M[]> {
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
            ...include,
          } as Prisma.InputJsonValue,
        },
      ],
    })) as unknown as M[];
  }

  public async createOne(data: Omit<PrismaModel<N>, 'id'>): Promise<M> {
    return this.repositoryBase.create({
      data,
      include: this.baseIncludes(),
    } as unknown as PrismaCreateArgs<N>);
  }

  public async createMany(data: Omit<PrismaModel<N>, 'id'>[]): Promise<M[]> {
    await this.repositoryBase.createMany({
      data,
    } as unknown as PrismaCreateArgs<N>);
    const searchPath = this.searchPaths()[0] as keyof Omit<PrismaModel<N>, 'id'>;
    return this.repositoryBase.findMany({
      where: {
        [searchPath]: { in: data.map((d) => d[searchPath]) },
      } as unknown as PrismaFilters<N>,
    } as PrismaArgs<N>);
  }

  public async updateOne(id: string, data: Partial<Omit<PrismaModel<N>, 'id'>>): Promise<M> {
    return this.repositoryBase.update({
      where: { id },
      data,
      include: this.baseIncludes(),
    } as PrismaUpdateArgs<N>);
  }

  public async updateOneByProperty<K extends keyof PrismaModel<N>>(
    key: K,
    value: PrismaModel<N>[K],
    data: Partial<Omit<PrismaModel<N>, 'id'>>,
  ) {
    return this.repositoryBase.update({
      where: { [key]: value } as unknown as PrismaFilters<N>,
      data,
      include: this.baseIncludes(),
    } as PrismaUpdateArgs<N>);
  }
}
