import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { QueryParams, useDivestraelQuery } from '@/hooks/query';
import { ClassConstructor } from 'class-transformer';
import { ArrayElement } from '@/types/globals';
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { merge } from 'lodash';

type QueryAllFunction<T extends object> = (
  params?: QueryParams<T>,
  config?: QueryObserverOptions<T>,
) => UseQueryResult<T[]>;

type QuerySearchFunction<T extends object> = (
  query: string,
  params?: Omit<QueryParams<T>, 'filter' | 'orderBy'>,
) => UseQueryResult<T[]>;

type QueryOneFunction<T extends object> = (
  id: string,
  params?: Omit<QueryParams<ArrayElement<T>>, 'filter' | 'orderBy'>,
) => UseQueryResult<T>;

export function createAllQuery<T extends object>(
  model: ClassConstructor<T>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryAllFunction<T> {
  return (params = {}) =>
    useDivestraelQuery<T[]>(model, url, config, params, {});
}

export function createSearchQuery<T extends object>(
  model: ClassConstructor<T>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QuerySearchFunction<T> {
  return (query, params = {}) => {
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
      { enabled: isEnabled },
    );
  };
}

export function createOneQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryOneFunction<T> {
  return (id, params = {}) => {
    const urlFixed = useMemo(() => `${url}/${id}`, [id]);
    return useDivestraelQuery(model, urlFixed, config, params, {});
  };
}
