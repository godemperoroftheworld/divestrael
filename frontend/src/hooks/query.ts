import { ArrayElement, DeepKey } from '@/types/globals';
import { ClassConstructor } from 'class-transformer';
import { AxiosRequestConfig } from 'axios';
import {
  QueryObserverOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import DivestraelApi from '@/api';
import { mapValues, merge } from 'lodash';
import { Filter } from '@/types/filter';
import stringify from '@/utils/filter';

type SortOrder = 'asc' | 'desc';
export interface QueryParams<T> {
  select?: DeepKey<T>[];
  include?: DeepKey<T>[];
  omit?: DeepKey<T>[];
  orderBy?: Array<[DeepKey<T>, SortOrder]>;
  filter?: Filter<T>;
  take?: number;
  skip?: number;
}

export function createQueryKey<T extends object>(
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
) {
  return [
    url,
    config.params,
    config.data,
    config.headers,
    ...Object.entries(params),
  ];
}
export function useQueryKey<T extends object>(
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
) {
  return useMemo(
    () => createQueryKey(url, config, params),
    [url, config, params],
  );
}

export function createQueryFn<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
) {
  return async () => {
    const filter = params.filter ? stringify(params.filter) : undefined;
    const fixedParams = merge({}, params, { filter });
    const response = await DivestraelApi.instance.request(
      {
        url,
        ...config,
        params: mapValues(merge({}, config.params, fixedParams), (val) => {
          if (Array.isArray(val)) {
            return val.join(',');
          }
          return val;
        }),
      },
      model,
    );
    return response.data;
  };
}
export function useQueryFn<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
) {
  return useCallback(
    () => createQueryFn(model, url, config, params),
    [model, url, config, params],
  );
}

export function createQueryOptions<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
  options: Partial<QueryObserverOptions<T>>,
) {
  const queryKey = createQueryKey(url, config, params);
  const queryFn = createQueryFn(model, url, config, params);
  return {
    ...options,
    queryKey,
    queryFn,
  };
}
export function useQueryOptions<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
  options: Partial<QueryObserverOptions<T>>,
): UseQueryOptions<T> {
  return useMemo(
    () => createQueryOptions(model, url, config, params, options),
    [model, url, config, params, options],
  );
}

export default function useDivestraelQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
  options: Partial<QueryObserverOptions<T>>,
): UseQueryResult<T> {
  const queryOptions = useQueryOptions(model, url, config, params, options);
  return useQuery(queryOptions);
}
