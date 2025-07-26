import { uniq } from 'lodash';

export function mergeClasses(...classStrings: (string | undefined)[]) {
  const allClasses = Array.from(classStrings)
    .filter((v) => !!v)
    .flatMap((str) => str!.split(' '));
  const uniqueClasses = uniq(allClasses);
  return uniqueClasses.join(' ');
}
