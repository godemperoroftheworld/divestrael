import { Prisma, PrismaClient } from '@prisma/client';
import { merge, set } from 'lodash';

import prisma from '@/prisma';
import { DeepKey } from '@/helpers/types.helper';
import { PrismaModel, PrismaModelExpanded, PrismaModelName } from '@/helpers/prisma.helper';
import { IdParams } from '@/schemas';

// Args
type PrismaOperations<N extends PrismaModelName> = Prisma.TypeMap['model'][N]['operations'];
type PrismaArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['findFirst']['args']>;
type PrismaCreateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['create']['args']>;
type PrismaUpdateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['update']['args']>;

// Filters
type PrismaFilters<N extends PrismaModelName> = PrismaArgs<N>['where'];
type PrismaSelect<N extends PrismaModelName> = PrismaArgs<N>['select'];
export interface PrismaServiceParams<N extends PrismaModelName> {
  select?: DeepKey<PrismaModel<N>>[];
  filter?: PrismaFilters<N>;
  include?: DeepKey<PrismaModel<N>>[];
  omit?: DeepKey<PrismaModel<N>>[];
  take?: number;
  skip?: number;
}

// Prisma repository
interface PrismaRepositoryBase<
  N extends PrismaModelName,
  T extends PrismaModelExpanded<N> = PrismaModelExpanded<N>,
> {
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

export default abstract class PrismaService<N extends PrismaModelName> {
  private static buildSelects<N extends PrismaModelName>(
    selects: DeepKey<PrismaModel<N>>[],
  ): Prisma.TypeMap['model'][N]['operations']['findUnique']['args']['where'] {
    const mappedSelects = selects.map((select) => {
      const splitSelect = select.split('.');
      return set({}, splitSelect, true);
    });
    return merge({}, ...mappedSelects);
  }

  protected readonly repository: PrismaClient[Lowercase<N>];
  protected constructor(private property: Lowercase<N>) {
    this.repository = prisma[property];
  }

  protected abstract searchPaths(): string[];

  protected abstract lookup(): object | undefined;

  private get repositoryBase() {
    return this.repository as unknown as PrismaRepositoryBase<N>;
  }

  public async getOne(id: string): Promise<PrismaModelExpanded<N>> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { id },
    } as PrismaArgs<N>);
  }

  public async getOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<PrismaModelExpanded<N>> {
    return this.repositoryBase.findUniqueOrThrow({
      where: { [property]: value } as unknown as PrismaFilters<N>,
    } as PrismaArgs<N>);
  }

  public async getMany(params: PrismaServiceParams<N> = {}): Promise<PrismaModelExpanded<N>[]> {
    const { select, filter, omit, include, skip, take } = params;
    const mergedSelectInclude = merge(
      {},
      select ? PrismaService.buildSelects(select) : {},
      include ? PrismaService.buildSelects(include) : {},
    );

    return this.repositoryBase.findMany({
      select: select ? mergedSelectInclude : undefined,
      where: filter,
      include: !select ? mergedSelectInclude : undefined,
      omit: omit ? PrismaService.buildSelects(omit) : undefined,
      skip,
      take,
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

  public async searchOne(query: string, fuzzy?: boolean): Promise<PrismaModelExpanded<N> | null> {
    const searchResult = (
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
              _id: true,
            },
          },
        ],
      })
    )[0];
    if (searchResult) {
      const { id } = searchResult as IdParams;
      return this.getOne(id);
    }
    return null;
  }

  public async searchMany(query: string, fuzzy?: boolean): Promise<PrismaModelExpanded<N>[]> {
    const searchResults = (await this.repository.aggregateRaw({
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
            _id: true,
          } as Prisma.InputJsonValue,
        },
      ],
    })) as unknown as IdParams[];
    if (searchResults.length) {
      const ids = searchResults.map((x) => x.id);
      return this.getMany({ filter: { id: { in: ids } } });
    }
    return [];
  }

  public async createOne(data: Omit<PrismaModel<N>, 'id'>): Promise<PrismaModelExpanded<N>> {
    return this.repositoryBase.create({
      data,
    } as unknown as PrismaCreateArgs<N>);
  }

  public async createMany(data: Omit<PrismaModel<N>, 'id'>[]): Promise<PrismaModelExpanded<N>[]> {
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

  public async updateOne(
    id: string,
    data: Partial<Omit<PrismaModel<N>, 'id'>>,
  ): Promise<PrismaModelExpanded<N>> {
    return this.repositoryBase.update({
      where: { id },
      data,
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
    } as PrismaUpdateArgs<N>);
  }
}
