'use client';

import React, { Children, PropsWithChildren, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import AutoScrollPlugin, {
  AutoScrollOptionsType,
} from 'embla-carousel-auto-scroll';

import './styles.module.css';
import { EmblaOptionsType } from 'embla-carousel';

type CarouselProps = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    options?: EmblaOptionsType;
    scroll?: AutoScrollOptionsType;
  }>;

export default function Carousel({
  children,
  className,
  options = {},
  scroll = { playOnInit: false },
  ...rest
}: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ ...options }, [
    WheelGesturesPlugin(),
    AutoScrollPlugin({ ...scroll }),
  ]);

  const embaClass = useMemo(() => `embla ${className}`, [className]);

  const mappedChildren = Children.map(children, (child, idx) => (
    <div
      className="emba__slide shrink-0"
      key={idx}>
      {child}
    </div>
  ));

  return (
    <div
      className={embaClass}
      {...rest}>
      <div
        className="embla__viewport overflow-hidden"
        ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {mappedChildren ?? []}
        </div>
      </div>
    </div>
  );
}
