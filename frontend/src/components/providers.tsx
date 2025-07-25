'use client';
import 'reflect-metadata';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import getQueryClient from '@/services/query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = getQueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}
