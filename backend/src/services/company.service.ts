import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';

interface Company {
  cw_id: string;
  cik: string;
  company_name: string;
  irs_number: number | null;
  sic_code: number | null;
  industry_name: string | null;
  sic_sector: number | null;
  sector_name: string | null;
  source_type: string;
  raw_address: string;
  country_code: string;
  subdiv_code: string;
  top_parent_id: string;
  num_parents: number;
  num_children: number;
  max_year: number;
  min_year: number;
}

// Service to get image from a query with google knowledge graph
export default class CompanyService {
  private static _instance: CompanyService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!CompanyService._instance) {
      CompanyService._instance = new CompanyService();
    }
    return CompanyService._instance;
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
    const companyValues: Company[] = Object.values(companies ?? {});
    if (companyValues.length) {
      return companyValues.find((c) => c.top_parent_id)?.top_parent_id;
    }
    return undefined;
  }

  private async getCompany(id: string) {
    const {
      data: { result },
    } = await this.axiosInstance.get(`/companies/${id}.json`);
    return result['companies'][id] as Company;
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
