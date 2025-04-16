import { Prisma, PrismaClient } from '@prisma/client';
import { isPlainObject, mapValues, merge, set } from 'lodash';
import prismaFQP from '@krsbx/prisma-fqp';

import prisma, { dmmf } from '@/prisma';
import { DeepKey } from '@/helpers/types.helper';
import {
  PrismaFilter,
  PrismaModel,
  PrismaModelExpanded,
  PrismaModelName,
} from '@/helpers/prisma.helper';
import { IdParams } from '@/schemas';

// Args
type PrismaOperations<N extends PrismaModelName> = Prisma.TypeMap['model'][N]['operations'];
type PrismaArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['findFirst']['args']>;
type PrismaCreateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['create']['args']>;
type PrismaUpdateArgs<N extends PrismaModelName> = Partial<PrismaOperations<N>['update']['args']>;

// Filters
export interface PrismaServiceParams<N extends PrismaModelName> {
  select?: DeepKey<PrismaModelExpanded<N>>[];
  filter?: PrismaFilter<N> | string;
  include?: DeepKey<PrismaModelExpanded<N>>[];
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
  count: (args: PrismaArgs<N>) => Promise<number>;
}

export default abstract class PrismaService<N extends PrismaModelName> {
  private static buildFilter<N extends PrismaModelName>(filter: string): PrismaFilter<N> {
    return prismaFQP(filter);
  }

  private static mergeSelectAndInclude<N extends PrismaModelName>(
    obj: { include: object; select: object } & { [key: string]: true },
  ): object {
    if (!isPlainObject(obj)) return obj;
    if (obj.select && obj.include) {
      return {
        select: merge(
          {},
          obj.select,
          mapValues(obj.include, PrismaService.mergeSelectAndInclude<N>),
        ),
      };
    }
    return mapValues(obj, (value: typeof obj) =>
      isPlainObject(value) ? PrismaService.mergeSelectAndInclude<N>(value) : value,
    );
  }

  protected readonly repository: PrismaClient[Lowercase<N>];
  protected constructor(private property: Lowercase<N>) {
    this.repository = prisma[property];
  }

  protected get models() {
    return dmmf!.datamodel.models;
  }

  protected get model() {
    return this.findModel(this.property)!;
  }

  protected findModel(name: Lowercase<PrismaModelName>) {
    return this.models.find((model) => model.name.toLowerCase() === name);
  }

  private buildIncludes(keys: DeepKey<PrismaModelExpanded<N>>[]): PrismaFilter<N> {
    const mapped = keys.map((key) => {
      let currentModel = this.model;
      const splitKey = key.split('.');
      const fixedKey = splitKey.reduce((result: string, keySegment, idx, arr) => {
        const field = currentModel.fields.find((f) => f.name === keySegment)!;
        if (field.relationName && idx + 1 !== arr.length) {
          currentModel = this.findModel(field.type.toLowerCase() as Lowercase<PrismaModelName>)!;
          return result + (result.length ? '.' : '') + `${keySegment}.include`;
        } else {
          return result + (result.length ? '.' : '') + `${keySegment}`;
        }
      }, '');
      return set({}, fixedKey, true);
    });

    const flexibleObject = merge({}, ...mapped);

    // We have to fold in select / include in the cases where there's both
    return PrismaService.mergeSelectAndInclude<N>(flexibleObject);
  }

  private buildSelects<N extends PrismaModelName>(keys: DeepKey<PrismaModelExpanded<N>>[]): object {
    const mapped = keys.map((key) => {
      let currentModel = this.model;
      const splitKey = key.split('.');
      const fixedKey = splitKey.reduce((result: string, keySegment, idx, arr) => {
        const field = currentModel.fields.find((f) => f.name === keySegment)!;
        if (field.relationName && idx + 1 != arr.length) {
          currentModel = this.findModel(field.type.toLowerCase() as Lowercase<PrismaModelName>)!;
          return result + (result.length ? '.' : '') + `${keySegment}.select`;
        } else {
          return result + (result.length ? '.' : '') + `${keySegment}`;
        }
      }, '');
      return set({}, fixedKey, true);
    });

    const flexibleObject = merge({}, ...mapped);

    // We have to fold in select / include in the cases where there's both
    return PrismaService.mergeSelectAndInclude<N>(flexibleObject);
  }

  protected abstract searchPaths(): string[];

  protected abstract lookup(): object | undefined;

  private get repositoryBase() {
    return this.repository as unknown as PrismaRepositoryBase<N>;
  }

  public async getOne(
    id: string,
    params: Omit<PrismaServiceParams<N>, 'filter' | 'take' | 'skip'> = {},
  ): Promise<PrismaModelExpanded<N>> {
    const { include, select } = params;
    return this.repositoryBase.findUniqueOrThrow({
      where: { id },
      select: select ? this.buildSelects(select) : undefined,
      include: include && !select ? this.buildIncludes(include) : undefined,
    } as PrismaArgs<N>);
  }

  public async getOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
    params: Omit<PrismaServiceParams<N>, 'filter' | 'take' | 'skip'> = {},
  ): Promise<PrismaModelExpanded<N>> {
    const { include, select } = params;
    return this.repositoryBase.findUniqueOrThrow({
      where: { [property]: value } as unknown as PrismaFilter<N>,
      select: select ? this.buildSelects(select) : undefined,
      include: include && !select ? this.buildIncludes(include) : undefined,
    } as PrismaArgs<N>);
  }

  public async getMany(params: PrismaServiceParams<N> = {}): Promise<PrismaModelExpanded<N>[]> {
    const { select, filter, include, skip, take } = params;
    const fixedFilter = typeof filter === 'string' ? PrismaService.buildFilter(filter) : filter;

    return this.repositoryBase.findMany({
      where: fixedFilter,
      select: select ? this.buildSelects(select) : undefined,
      include: include && !select ? this.buildIncludes(include) : undefined,
      skip,
      take,
    } as PrismaArgs<N>);
  }

  public async count(params: Pick<PrismaServiceParams<N>, 'filter'> = {}): Promise<number> {
    const { filter } = params;
    const fixedFilter = typeof filter === 'string' ? PrismaService.buildFilter(filter) : filter;
    return this.repositoryBase.count({
      where: fixedFilter,
    } as PrismaArgs<N>);
  }

  public async hasOne(id: string): Promise<boolean> {
    const count = await this.count({ filter: { id } });
    return count > 0;
  }

  public async hasOneByProperty<K extends keyof PrismaModel<N>>(
    property: K,
    value: PrismaModel<N>[K],
  ): Promise<boolean> {
    const count = await this.count({
      filter: { [property]: value },
    });
    return count > 0;
  }

  public async searchOne(
    query: string,
    fuzzy?: boolean,
    params: Omit<PrismaServiceParams<N>, 'filter' | 'take' | 'skip'> = {},
  ): Promise<PrismaModelExpanded<N> | null> {
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
      return this.getOne(id, params);
    }
    return null;
  }

  public async searchMany(
    query: string,
    fuzzy: boolean = false,
    params: Omit<PrismaServiceParams<N>, 'filter'> = {},
  ): Promise<PrismaModelExpanded<N>[]> {
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
      return this.getMany({
        filter: { id: { in: ids } },
        ...params,
      });
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
      } as unknown as PrismaFilter<N>,
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
      where: { [key]: value } as unknown as PrismaFilter<N>,
      data,
    } as PrismaUpdateArgs<N>);
  }
}
