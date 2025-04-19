import { UseQueryResult } from '@tanstack/react-query';
import { QueryParams, useDivestraelQuery } from '@/hooks/query';
import { ClassConstructor } from 'class-transformer';
import { ArrayElement } from '@/types/globals';
import { AxiosRequestConfig } from 'axios';

type QueryFunction<T extends object> = (
  params?: QueryParams<T>,
) => UseQueryResult<T>;

export function createQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
): QueryFunction<T> {
  return (params = {}) => useDivestraelQuery<T>(model, url, config, params);
}
