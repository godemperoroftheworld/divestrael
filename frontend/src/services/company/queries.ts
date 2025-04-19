import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Company from '@/types/api/company';

const useCompanies = createAllQuery(Company, 'company');
const useSearchCompanies = createSearchQuery(Company, 'company');
const useCompany = createOneQuery(Company, 'company');

export { useCompanies, useSearchCompanies, useCompany };
