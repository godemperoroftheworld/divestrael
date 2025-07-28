import React, {
  Children,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
} from 'react';

import './styles.module.css';
import { mergeClasses } from '@/utils/class';

type CarouselProps = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    childClassName?: string;
  }>;

function ServerCarousel(
  { children, className, childClassName, ...rest }: CarouselProps,
  ref: ForwardedRef<HTMLDivElement | null>,
) {
  const mappedChildren = Children.map(children, (child, idx) => (
    <div
      className={mergeClasses('emba__slide shrink-0', childClassName)}
      key={idx}>
      {child}
    </div>
  ));

  return (
    <div
      className={mergeClasses('embla', className)}
      {...rest}>
      <div
        className="embla__viewport overflow-hidden"
        ref={ref}>
        <div className="embla__container flex gap-4">
          {mappedChildren ?? []}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ServerCarousel);
