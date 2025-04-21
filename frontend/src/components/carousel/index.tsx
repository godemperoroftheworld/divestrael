import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import './styles.module.css';

interface CarouselProps {
  children: React.ReactNode[];
}

export default function Carousel({ children }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, skipSnaps: true }, [
    WheelGesturesPlugin(),
  ]);

  return (
    <div className="embla">
      <div
        className="embla__viewport overflow-hidden"
        ref={emblaRef}>
        <div className="embla__container flex">
          {children.map((child, idx) => (
            <div
              className="emba__slide shrink-0"
              key={idx}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
