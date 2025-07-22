import { ClassConstructor } from 'class-transformer';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import DivestraelApi from '@/api';
import { AxiosRequestConfig } from 'axios';
import type { MutationObserverOptions } from '@tanstack/query-core';

export function useDivestraelMutation<T extends object, B extends object>(
  model: ClassConstructor<T>,
  url: string,
  config: Omit<AxiosRequestConfig<B>, 'url' | 'data'>,
  data: B,
  options: Partial<MutationObserverOptions<T>>,
): UseMutationResult<T, Error, void> {
  const mutationFn = useCallback(async () => {
    const response = await DivestraelApi.instance.request(
      {
        url,
        ...config,
        data,
      },
      model,
    );
    return response.data;
  }, [url, config, model]);

  return useMutation({
    ...options,
    mutationFn,
  });
}
