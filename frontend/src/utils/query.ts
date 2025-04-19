import { UseQueryResult } from '@tanstack/react-query';
import { QueryParams, useDivestraelQuery } from '@/hooks/query';
import { ClassConstructor } from 'class-transformer';
import { ArrayElement } from '@/types/globals';
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';

type QueryAllFunction<T extends object> = (
  params?: QueryParams<ArrayElement<T>>,
) => UseQueryResult<T>;

type QueryOneFunction<T extends object> = (
  id: string,
  params?: Omit<QueryParams<ArrayElement<T>>, 'filter' | 'orderBy'>,
) => UseQueryResult<T>;

export function createAllQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryAllFunction<T> {
  return (params = {}) => useDivestraelQuery<T>(model, url, config, params);
}

export function createOneQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryOneFunction<T> {
  return (id, params = {}) => {
    const urlFixed = useMemo(() => `${url}/${id}`, [id]);
    return useDivestraelQuery(model, urlFixed, config, params);
  };
}
