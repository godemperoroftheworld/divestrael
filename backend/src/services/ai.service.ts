import axios, { AxiosInstance } from 'axios';

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

  public async getCompany(product: string, brand: string) {
    return this.axiosInstance
      .get('chat/completions', {
        data: {
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `I am going to give you a product and brand name. I want you to give me the company name that owns that brand/product. Product: ${product}, Brand: ${brand}`,
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
      .then((r) => JSON.parse(r.data.choices[0].message.content));
  }
}
