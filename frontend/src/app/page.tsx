'use client';
import { useBrands } from '@/services/brand/queries';

export default function Home() {
  const { data } = useBrands({});

  return <div>{JSON.stringify(data)}</div>;
}
