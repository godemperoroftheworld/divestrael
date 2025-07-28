'use client';

import Camera from 'react-webcam';
import {
  HTMLAttributes,
  forwardRef,
  ForwardedRef,
  useState,
  useCallback,
} from 'react';
import { mergeClasses } from '@/utils/class';
function ProductCamera(
  { className, ...props }: HTMLAttributes<HTMLDivElement>,
  ref: ForwardedRef<Camera | null>,
) {
  const [isInitialised, setIsInitialised] = useState(false);

  // 50ms delay otherwise it like flickers
  const onInit = useCallback(
    () =>
      setTimeout(() => {
        setIsInitialised(true);
      }, 100),
    [],
  );

  return (
    <div
      className={mergeClasses(
        className,
        'bg-gray-500',
        isInitialised ? undefined : 'animate-pulse',
      )}
      {...props}>
      <Camera
        ref={ref}
        className={mergeClasses(
          'w-xl max-w-full',
          isInitialised ? undefined : 'max-md:aspect-[3/4] md:aspect-[4/3]',
        )}
        videoConstraints={{ facingMode: 'environment' }}
        screenshotFormat="image/png"
        disablePictureInPicture={true}
        onUserMedia={onInit}
      />
    </div>
  );
}

export default forwardRef(ProductCamera);
