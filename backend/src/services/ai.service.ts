import axios, { AxiosInstance } from 'axios';

interface CompanyApiResult {
  name: string;
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
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${process.env.AI_API_KEY}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    });
  }

  public async getCompany(product: string, brand?: string) {
    const prompt = `I am going to give you some product information. I want you to give me the company name that owns that brand/product. Product: ${product}${brand ? `, Brand: ${brand}` : ''}`;
    return this.axiosInstance
      .get('chat/completions', {
        data: {
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
        },
      })
      .then((r) => JSON.parse(r.data.choices[0].message.content) as CompanyApiResult);
  }
}
