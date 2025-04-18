import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';
import { countBy, maxBy } from 'lodash';
import { Country } from '@prisma/client';

export interface CorpwatchCompanyResponse {
  cw_id: string;
  cik: number;
  company_name: string;
  irs_number: number | null;
  sic_code: number | null;
  industry_name: string | null;
  sic_sector: number | null;
  sector_name: string | null;
  source_type: string;
  raw_address: string;
  country_code: Country;
  subdiv_code: string;
  top_parent_id: string;
  num_parents: number;
  num_children: number;
  max_year: number;
  min_year: number;
}

// Service to get image from a query with google knowledge graph
export default class CorpwatchService {
  private static _instance: CorpwatchService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!CorpwatchService._instance) {
      CorpwatchService._instance = new CorpwatchService();
    }
    return CorpwatchService._instance;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://api.corpwatch.org/',
    });
    this.axiosInstance.interceptors.request.use((config) => {
      // Add Authorization Header
      config.params = {
        ...config.params,
        key: process.env.CORPWATCH_API_KEY,
      };
      return config;
    });
  }

  private async getTopCompanyID(company: string) {
    const {
      data: { result },
    } = await this.axiosInstance.get('/companies.json', {
      params: {
        company_name: company,
      },
    });
    const { companies } = result;
    const companyValues: CorpwatchCompanyResponse[] = Object.values(companies ?? {});
    if (companyValues.length) {
      const companyParents = countBy(companyValues, 'top_parent_id');
      return maxBy(Object.keys(companyParents), (key) => companyParents[key]);
    }
    return undefined;
  }

  private async getCompany(id: string): Promise<CorpwatchCompanyResponse> {
    const {
      data: { result },
    } = await this.axiosInstance.get(`/companies/${id}.json`);
    const response = result['companies'][id];
    return {
      ...response,
      cik: isNaN(response.cik) ? null : Number(response.cik),
    };
  }

  public async findTopCompany(company: string) {
    const topCompanyID = await this.getTopCompanyID(company);
    if (topCompanyID) {
      return await this.getCompany(topCompanyID);
    }
    return null;
  }

  public async getTopCompany(id: string) {
    const company = await this.getCompany(id);
    return this.getCompany(company.top_parent_id);
  }

  public async getSubsidiaries(id: string) {
    const topCompany = await this.getTopCompany(id);
    const {
      data: { result },
    } = await this.axiosInstance.get('/companies.json', {
      params: {
        top_parent_id: topCompany.cw_id,
      },
    });
    const { companies } = result;
    return Object.values(companies ?? {});
  }
}
