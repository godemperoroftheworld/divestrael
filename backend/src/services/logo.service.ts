import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';

// Service to get image from a query with google knowledge graph
export default class LogoService {
  private static _instance: LogoService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!LogoService._instance) {
      LogoService._instance = new LogoService();
    }
    return LogoService._instance;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://kgsearch.googleapis.com/v1/entities:search',
    });
    this.axiosInstance.interceptors.request.use((config) => {
      // Add Authorization Header
      config.params = {
        ...config.params,
        key: process.env.GOOGLE_API_KEY,
      };
      return config;
    });
  }

  public async getImage(query: string) {
    const result = await this.axiosInstance.get('/', {
      params: {
        query,
        limit: 1,
      },
    });
    return result.data.itemListElement[0].result.image.url;
  }
}
