'use client';

import ProductCamera from '@/components/snap/product-camera';
import Button from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';
import Webcam from 'react-webcam';
import { usePostProduct } from '@/services/product/mutations';
import { useRouter } from 'next/navigation';

export default function Page() {
  const ref = useRef<Webcam>(null);
  const { mutateAsync, isPending } = usePostProduct();
  const router = useRouter();

  async function onClick() {
    const image = ref.current?.getScreenshot() as string;
    const { id } = await mutateAsync({
      image,
    });
    router.push(`/product/${id}`);
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
