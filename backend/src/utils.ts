import { distance } from 'fastest-levenshtein';

export function uncapitalize(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const NAME_SIMILARITY_THRESHOLD = 0.75;
export function areNamesSimilar(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  const longest = Math.max(left.length, right.length);
  if (longest === 0) return true;
  const similarity = 1 - distance(left, right) / longest;
  return similarity >= NAME_SIMILARITY_THRESHOLD;
}
