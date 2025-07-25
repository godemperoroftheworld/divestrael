import {
  createAllQuery,
  createOneQuery,
  createSearchQuery,
} from '@/utils/query';
import Company from '@/types/api/company';

const { prefetchQuery: prefetchCompanies, useQuery: useCompanies } =
  createAllQuery(Company, 'company');
const { useQuery: useSearchCompanies } = createSearchQuery(Company, 'company');
const { prefetchQuery: prefetchCompany, useQuery: useCompany } = createOneQuery(
  Company,
  'company',
);

export {
  useCompanies,
  prefetchCompanies,
  useSearchCompanies,
  useCompany,
  prefetchCompany,
};
