import { ClassConstructor } from 'class-transformer';
import {
  MutationFunction,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import DivestraelApi from '@/api';
import { AxiosRequestConfig } from 'axios';
import type { MutationObserverOptions } from '@tanstack/query-core';
import { ArrayElement } from '@/types/globals';

export function useDivestraelMutation<R extends object, V extends object>(
  model: ClassConstructor<ArrayElement<R>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url' | 'data'>,
  options: Partial<MutationObserverOptions<R, Error, V>>,
): UseMutationResult<R, Error, V> {
  const mutationFn: MutationFunction<R, V> = useCallback(
    async (data: V) => {
      const response = await DivestraelApi.instance.request(
        {
          url,
          ...config,
          data,
        },
        model,
      );
      return response.data;
    },
    [url, config, model],
  );

  return useMutation<R, Error, V>({
    ...options,
    mutationFn,
  });
}
