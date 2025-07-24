'use client';

import Camera from 'react-webcam';
import { HTMLAttributes, forwardRef, ForwardedRef } from 'react';
function ProductCamera(
  props: HTMLAttributes<HTMLDivElement>,
  ref: ForwardedRef<Camera | null>,
) {
  return (
    <div {...props}>
      <Camera
        ref={ref}
        screenshotFormat="image/png"
        disablePictureInPicture={true}
      />
    </div>
  );
}

export default forwardRef(ProductCamera);
