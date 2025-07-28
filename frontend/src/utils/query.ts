import {
  QueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import useDivestraelQuery, {
  createQueryOptions,
  QueryParams,
} from '@/hooks/query';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ArrayElement } from '@/types/globals';
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { merge } from 'lodash';

type QueryAllPrefetch<T extends object> = (
  queryClient: QueryClient,
  params?: QueryParams<T>,
) => Promise<T[]>;
type QueryAllFunction<T extends object> = (
  params?: QueryParams<T>,
) => UseQueryResult<T[]>;
interface QueryAllResult<T extends object> {
  prefetchQuery: QueryAllPrefetch<T>;
  useQuery: QueryAllFunction<T>;
}

type QuerySearchFunction<T extends object> = (
  query: string,
  params?: Omit<QueryParams<T>, 'filter' | 'orderBy'>,
  options?: Partial<UseQueryOptions<T[]>>,
) => UseQueryResult<T[]>;
interface QuerySearchResult<T extends object> {
  useQuery: QuerySearchFunction<T>;
}

type QueryOnePrefetch<T extends object> = (
  queryClient: QueryClient,
  id?: string,
  params?: Omit<QueryParams<ArrayElement<T>>, 'filter' | 'orderBy'>,
) => Promise<T>;
type QueryOneFunction<T extends object> = (
  id?: string,
  params?: Omit<QueryParams<ArrayElement<T>>, 'filter' | 'orderBy'>,
) => UseQueryResult<T>;
interface QueryOneResult<T extends object> {
  prefetchQuery: QueryOnePrefetch<T>;
  useQuery: QueryOneFunction<T>;
}

export function createAllQuery<T extends object>(
  model: ClassConstructor<T>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryAllResult<T> {
  return {
    prefetchQuery: async (queryClient, params = {}) => {
      const queryOptions = createQueryOptions<T[]>(model, url, config, params, {
        staleTime: 10 * 6000,
      });
      return await queryClient.fetchQuery(queryOptions);
    },
    useQuery: (params = {}) =>
      useDivestraelQuery<T[]>(model, url, config, params, {
        select: (data) => data.map((d) => plainToInstance(model, d)),
      }),
  };
}

export function createSearchQuery<T extends object>(
  model: ClassConstructor<T>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QuerySearchResult<T> {
  return {
    useQuery: (query, params = {}, options = {}) => {
      const configFixed = useMemo(
        () =>
          merge({}, config, {
            params: {
              query,
            },
          }),
        [query],
      );
      const isEnabled = useMemo(() => !!query.length, [query]);
      return useDivestraelQuery<T[]>(
        model,
        `${url}/search`,
        configFixed,
        params,
        {
          enabled: isEnabled,
          ...options,
        },
      );
    },
  };
}

export function createOneQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryOneResult<T> {
  return {
    prefetchQuery: async (queryClient, id, params = {}) => {
      const queryOptions = createQueryOptions<T>(
        model,
        `${url}/${id}`,
        config,
        params,
        {
          staleTime: 10 * 6000,
        },
      );
      return await queryClient.fetchQuery(queryOptions);
    },
    useQuery: (id, params = {}) => {
      const urlFixed = useMemo(() => `${url}/${id}`, [id]);
      const isEnabled = useMemo(() => !!id, [id]);
      return useDivestraelQuery(model, urlFixed, config, params, {
        enabled: isEnabled,
        select: (data) => plainToInstance(model, data) as T,
      });
    },
  };
}
