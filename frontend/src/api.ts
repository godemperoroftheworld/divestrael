import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { isClass } from '@/utils/globals';
import { ArrayElement } from '@/types/globals';

export type ApiResponse<T> = { data: T; count?: number };

export default class DivestraelApi {
  private static _instance: DivestraelApi;

  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new DivestraelApi();
    }
    return this._instance;
  }

  async request<T extends object>(
    config: AxiosRequestConfig,
    model?: ClassConstructor<ArrayElement<T>>,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.request(config).then((r) => {
      let data: T;
      if (model && isClass(model)) {
        const instanceData = plainToInstance(model, r.data) as T;
        data = Object.freeze(instanceData);
      } else {
        data = Object.freeze(r.data);
      }
      const count = r.headers['x-total-count']
        ? Number(r.headers['x-total-count'])
        : undefined;
      return { data, count };
    });
  }

  async get<T extends object>(
    url: string,
    config: AxiosRequestConfig = {},
    model?: ClassConstructor<ArrayElement<T>>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: 'GET',
        url,
        ...config,
      },
      model,
    );
  }

  async post<T extends object>(
    url: string,
    data: object,
    config: AxiosRequestConfig = {},
    model?: ClassConstructor<ArrayElement<T>>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: 'POST',
        url,
        data,
        ...config,
      },
      model,
    );
  }

  async put<T extends object>(
    url: string,
    data: object,
    config: AxiosRequestConfig = {},
    model?: ClassConstructor<ArrayElement<T>>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: 'PUT',
        url,
        data,
        ...config,
      },
      model,
    );
  }

  async delete<T extends object>(
    url: string,
    config: AxiosRequestConfig = {},
    model?: ClassConstructor<ArrayElement<T>>,
  ) {
    return this.request<T>(
      {
        method: 'DELETE',
        url,
        ...config,
      },
      model,
    );
  }
}
