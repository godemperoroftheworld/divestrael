import { ClassConstructor } from 'class-transformer';
import { AxiosRequestConfig } from 'axios';
import { useDivestraelMutation } from '@/hooks/mutate';
import { ArrayElement } from '@/types/globals';

export function createPostMutation<T extends object>(
  model: ClassConstructor<ArrayElement<T>>,
  url: string,
  config: Omit<AxiosRequestConfig, 'url'> = {},
) {
  return (data = {}) => useDivestraelMutation(model, url, config, data, {});
}
