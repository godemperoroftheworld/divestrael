import { DeepKey } from '@/types/globals';

export enum FilterOperator {
  NOT_EQUAL = '!=',
  GREATER_EQUAL = '>=',
  LESS_EQUAL = '<=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS WITH',
  ENDS_WITH = 'ENDS WITH',
  LIKE = 'LIKE',
  DOES_NOT_CONTAIN = 'DOES NOT CONTAIN',
  EQUALS = 'EXACTLY MATCHES',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  NULL = 'NULL',
  NOT_NULL = 'NOT NULL',
}

export interface FilterRule<T> {
  field: DeepKey<T>;
  operator: FilterOperator;
  value?: unknown;
}

export interface Filter<T> {
  combinator?: 'AND' | 'OR';
  rules: Array<FilterRule<T> | Filter<T>>;
  not?: boolean;
}
