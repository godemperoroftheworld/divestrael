import React, { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import AutoScrollPlugin from 'embla-carousel-auto-scroll';

import './styles.module.css';

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode[];
  autoScroll?: boolean;
  autoScrollSpeed?: number;
};

export default function Carousel({
  children,
  className,
  autoScroll,
  autoScrollSpeed,
  ...rest
}: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, skipSnaps: true }, [
    WheelGesturesPlugin(),
    AutoScrollPlugin({ playOnInit: autoScroll, speed: autoScrollSpeed ?? 1 }),
  ]);

  const embaClass = useMemo(() => `embla ${className}`, [className]);

  return (
    <div
      className={embaClass}
      {...rest}>
      <div
        className="embla__viewport overflow-hidden"
        ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {children?.map((child, idx) => (
            <div
              className="emba__slide shrink-0"
              key={idx}>
              {child}
            </div>
          )) ?? []}
        </div>
      </div>
    </div>
  );
}
