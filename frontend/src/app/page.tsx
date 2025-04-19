'use client';
import { useBrands } from '@/services/company/queries';

export default function Home() {
  const { data } = useBrands({});

  return <div>{JSON.stringify(data)}</div>;
}
