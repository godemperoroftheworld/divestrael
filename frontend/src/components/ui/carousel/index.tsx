'use client';

import React, { PropsWithChildren } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import AutoScrollPlugin, {
  AutoScrollOptionsType,
} from 'embla-carousel-auto-scroll';

import { EmblaOptionsType } from 'embla-carousel';
import ServerCarousel from './server';

type CarouselProps = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    options?: EmblaOptionsType;
    scroll?: AutoScrollOptionsType;
  }>;

export default function Carousel({
  children,
  options = {},
  scroll = { playOnInit: false },
  ...rest
}: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ ...options }, [
    WheelGesturesPlugin(),
    AutoScrollPlugin({ ...scroll }),
  ]);

  return (
    <ServerCarousel
      {...rest}
      ref={emblaRef}>
      {children}
    </ServerCarousel>
  );
}
