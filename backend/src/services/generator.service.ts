import axios, { AxiosInstance } from 'axios';
import { Country } from '@prisma/client';
import process from 'node:process';

import CompanyService from '@/services/company.service';

interface CompanyApiResult {
  name: string;
  country: Country;
  brand: string;
}
interface BrandsApiResult {
  names: string[];
}

// Service to get product company name
export default class AIService {
  private static _instance: AIService;

  private generatorInstance: AxiosInstance;
  private kgInstance: AxiosInstance;

  public static get instance() {
    if (!AIService._instance) {
      AIService._instance = new AIService();
    }
    return AIService._instance;
  }

  private constructor() {
    this.generatorInstance = axios.create({
      baseURL: 'https://openrouter.ai/api/v1/',
    });
    this.kgInstance = axios.create({
      baseURL: 'https://kgsearch.googleapis.com/v1/entities:search',
    });
    this.generatorInstance.defaults.headers.common['Authorization'] =
      `Bearer ${process.env.AI_API_KEY}`;
    this.kgInstance.interceptors.request.use((config) => {
      // Add Authorization Header
      config.params = {
        ...config.params,
        key: process.env.GOOGLE_API_KEY,
      };
      return config;
    });
  }

  public async getMetadata(query: string) {
    const result = await this.kgInstance.get('/', {
      params: {
        query,
        limit: 1,
      },
    });
    const resultItem = result.data.itemListElement[0]?.result;
    return {
      description: resultItem.detailedDescription?.articleBody || resultItem?.description || query,
      image: resultItem?.image?.contentUrl,
    };
  }

  public async generateBrands(companyId: string) {
    const company = await CompanyService.instance.getOne(companyId);
    const prompt = `I am going to give you some company information. I want you to give me all of the brands (in english) that belong to that company. The list should be exhaustive. If you don't know the company, or don't know any subsidiaries for the company, return an empty list. Company: ${company.name}, Country: ${company.country}`;
    const brandsResult = await this.generatorInstance.post('chat/completions', {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      provider: {
        require_parameters: true,
      },
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'brands',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              names: {
                type: 'array',
                description: 'The brand names',
                items: {
                  type: 'string',
                },
              },
            },
            required: ['names'],
            additionalProperties: false,
          },
        },
      },
    });
    const { names } = JSON.parse(brandsResult.data.choices[0].message.content) as BrandsApiResult;
    const trimmedNames = names.map((name) => name.trim());
    return trimmedNames.map((name) => ({
      name,
      companyId,
    }));
  }

  public async generateCompanyInfo(product?: string, brandName?: string) {
    const prompt = `I am going to give you some product/brand information. I want you to give me the country code and name of the company that owns that brand/product.`;
    const promptInfo = [];
    if (product) {
      promptInfo.push(`Product: ${product}`);
    }
    if (brandName) {
      promptInfo.push(`Brand: ${brandName}`);
    }
    const { country, name } = await this.generatorInstance
      .post('chat/completions', {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: `${prompt} ${promptInfo.join(', ')}`,
          },
        ],
        provider: {
          require_parameters: true,
        },
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'company',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The company name',
                },
                country: {
                  type: 'string',
                  description: 'The country the company is from, as a 2 letter code',
                },
              },
              required: ['name', 'country'],
              additionalProperties: false,
            },
          },
        },
      })
      .then((r) => JSON.parse(r.data.choices[0].message.content) as CompanyApiResult);
    return { country, name };
  }
}
