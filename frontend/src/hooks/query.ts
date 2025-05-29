import { ArrayElement, DeepKey } from '@/types/globals';
import { ClassConstructor } from 'class-transformer';
import { AxiosRequestConfig } from 'axios';
import {
  QueryObserverOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import DivestraelApi from '@/api';
import { merge } from 'lodash';
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

export function useDivestraelQuery<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'>,
  params: QueryParams<ArrayElement<T>>,
  options: Partial<QueryObserverOptions<T>>,
): UseQueryResult<T> {
  const queryKey = useMemo(() => {
    return [
      url,
      config.params,
      config.data,
      config.headers,
      ...Object.entries(params),
    ];
  }, [url, config, params]);
  const queryFn = useCallback(async () => {
    const filter = params.filter ? stringify(params.filter) : undefined;
    const fixedParams = merge({}, params, { filter });
    const response = await DivestraelApi.instance.request(
      {
        url,
        ...config,
        params: merge({}, config.params, fixedParams),
      },
      model,
    );
    return response.data;
  }, [url, config, params, model]);
  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
