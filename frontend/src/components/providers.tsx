'use client';
import 'reflect-metadata';

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import getQueryClient from '@/services/query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

const queryClient = getQueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('render');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <ReactQueryDevtools />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
