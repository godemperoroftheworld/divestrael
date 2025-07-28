import { HTMLAttributes } from 'react';
import Skeleton from '@/components/ui/skeleton';
import { mergeClasses } from '@/utils/class';

interface Props extends HTMLAttributes<HTMLDivElement> {
  lineClass: string;
  lineCount: number;
}

export default function ParagraphSkeleton({
  lineClass,
  lineCount,
  className,
  ...props
}: Props) {
  return (
    <div
      className={mergeClasses(className, 'flex flex-col gap-1')}
      {...props}>
      {Array.from({ length: lineCount }).map((_, i) => (
        <Skeleton
          key={i}
          className={lineClass}
        />
      ))}
    </div>
  );
}
