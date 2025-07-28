import { HTMLAttributes } from 'react';
import { mergeClasses } from '@/utils/class';

export default function Skeleton({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={mergeClasses(className, 'bg-gray-500 rounded animate-pulse')}
      {...rest}
    />
  );
}
