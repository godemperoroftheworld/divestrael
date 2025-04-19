'use client';
import { useSearchBrands } from '@/services/brand/queries';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const { data } = useSearchBrands(query);

  return (
    <div>
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div>
        {data?.map((x) => {
          return <div key={x.id}>{x.name}</div>;
        })}
      </div>
    </div>
  );
}
