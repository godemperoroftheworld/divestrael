import ServerCarousel from '@/components/ui/carousel/server';
import { HTMLAttributes } from 'react';
import Skeleton from '@/components/ui/skeleton';

interface Props extends HTMLAttributes<HTMLDivElement> {
  itemCount: number;
  itemClass: string;
}

export default function CarouselSkeleton({
  itemCount,
  itemClass,
  ...props
}: Props) {
  const skeletonChildren = Array.from({ length: itemCount }).map((_, i) => (
    <Skeleton
      key={i}
      className={itemClass}
    />
  ));

  return <ServerCarousel {...props}>{skeletonChildren}</ServerCarousel>;
}
