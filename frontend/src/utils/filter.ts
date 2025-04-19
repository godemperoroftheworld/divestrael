import { Filter, FilterRule } from '@/types/filter';

function stringifyFilter<T>(filter: Filter<T>): string {
  const filterPrefix = filter.not ? '!' : '';
  const filterContent = filter.rules
    .map((fr) => {
      if ('rules' in fr) return stringifyFilter(fr);
      else return stringifyRule(fr);
    })
    .join(filter.combinator ?? ' AND ');
  return `${filterPrefix}(${filterContent})`;
}

function stringifyRule<T>(filter: FilterRule<T>): string {
  const fixedValue =
    typeof filter.value === 'string' ? `"${filter.value}"` : filter.value;
  return `${filter.field} ${filter.operator} ${fixedValue}`;
}

export default function stringify<T>(filter: Filter<T>): string {
  return stringifyFilter(filter);
}
