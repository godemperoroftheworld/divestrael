import axios, { AxiosInstance } from 'axios';

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

  public async getBrands(company: string) {
    const prompt = `I am going to give you some company information. I want you to give me the brands that belong to that company. Company: ${company}`;
    return this.axiosInstance
      .post('chat/completions', {
        model: 'openai/gpt-4o-mini',
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
      })
      .then((r) => JSON.parse(r.data.choices[0].message.content) as BrandsApiResult);
  }

  public async getCompany(product: string, brand?: string) {
    const prompt = `I am going to give you some product information. I want you to give me the company name that owns that brand/product. Product: ${product}${brand ? `, Brand: ${brand}` : ''}`;
    return this.axiosInstance
      .post('chat/completions', {
        model: 'openai/gpt-4o-mini',
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
