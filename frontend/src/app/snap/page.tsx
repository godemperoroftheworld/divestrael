'use client';

import ProductCamera from '@/components/snap/product-camera';
import Button from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';
import Webcam from 'react-webcam';
import { usePostProduct } from '@/services/product/mutations';

export default function Page() {
  const ref = useRef<Webcam>(null);
  const { mutateAsync, isPending } = usePostProduct();

  async function onClick() {
    const image = ref.current?.getScreenshot() as string;
    const product = await mutateAsync({
      image,
    });
    console.log(product);
  }

  return (
    <>
      <ProductCamera
        className="rounded overflow-hidden"
        ref={ref}
      />
      <Button
        disabled={isPending}
        className="mx-auto"
        onClick={onClick}>
        <MagnifyingGlassIcon className="w-6" />
        Lookup
      </Button>
    </>
  );
}
