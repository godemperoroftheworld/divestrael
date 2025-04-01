import axios, { AxiosInstance } from 'axios';
import { Country } from '@prisma/client';

interface CompanyApiResult {
  name: string;
}
interface BrandsApiResult {
  names: string[];
}

// Service to get product company name
export default class AIService {
  private static _instance: AIService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!AIService._instance) {
      AIService._instance = new AIService();
    }
    return AIService._instance;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://openrouter.ai/api/v1/',
    });
    this.axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${process.env.AI_API_KEY}`;
  }

  public async getBrands(company: string, country?: Country) {
    let prompt = `I am going to give you some company information. I want you to give me all of the brands (in english) that belong to that company. The list should be exhaustive. If you don't know the company, or don't know any subsidiaries for the company, return an empty list. Company: ${company}`;
    if (country) {
      prompt = `${prompt}, Country: ${country}`;
    }
    const result = await this.axiosInstance.post('chat/completions', {
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
    const { names } = JSON.parse(result.data.choices[0].message.content) as BrandsApiResult;
    return names.map((name) => name.trim());
  }

  public async getCompany(product: string, brand?: string) {
    const prompt = `I am going to give you some product information. I want you to give me the company name that owns that brand/product. Product: ${product}${brand ? `, Brand: ${brand}` : ''}`;
    return this.axiosInstance
      .post('chat/completions', {
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
            name: 'company',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The company name',
                },
              },
              required: ['name'],
              additionalProperties: false,
            },
          },
        },
      })
      .then((r) => JSON.parse(r.data.choices[0].message.content) as CompanyApiResult);
  }
}
