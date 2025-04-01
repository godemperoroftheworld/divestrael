import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';

// Service to get image from a query with google knowledge graph
export default class KGService {
  private static _instance: KGService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!KGService._instance) {
      KGService._instance = new KGService();
    }
    return KGService._instance;
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

  public async getImage(query: string): Promise<string | undefined> {
    const result = await this.axiosInstance.get('/', {
      params: {
        query,
        limit: 1,
      },
    });
    const resultItem = result.data.itemListElement[0]?.result;
    return resultItem?.image?.contentUrl;
  }

  public async getDescription(query: string): Promise<string> {
    const result = await this.axiosInstance.get('/', {
      params: {
        query,
        limit: 1,
      },
    });
    const resultItem = result.data.itemListElement[0]?.result;
    return resultItem?.detailedDescription?.articleBody || resultItem?.description || query;
  }
}
