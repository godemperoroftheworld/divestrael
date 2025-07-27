'use client';

import { useIsMutating } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function Loader() {
  const mutatingCount = useIsMutating();
  const isMutating = useMemo(() => !!mutatingCount, [mutatingCount]);

  if (!isMutating) return null;

  return (
    <div className="absolute left-0 top-0 w-dvw h-dvh flex items-center justify-center bg-gray-500/50">
      <ArrowPathIcon className="w-32 text-danger animate-spin" />
    </div>
  );
}
