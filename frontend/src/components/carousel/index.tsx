import React, { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import './styles.module.css';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
}

export default function Carousel({ children, className }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, skipSnaps: true }, [
    WheelGesturesPlugin(),
  ]);

  const embaClass = useMemo(() => `embla ${className}`, [className]);

  return (
    <div className={embaClass}>
      <div
        className="embla__viewport overflow-hidden"
        ref={emblaRef}>
        <div className="embla__container flex gap-2">
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
