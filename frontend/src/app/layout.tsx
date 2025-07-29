import './globals.css';
import Providers from '@/components/providers';
import Loader from '@/components/loader';
import React, { PropsWithChildren } from 'react';
import { Work_Sans, Archivo } from 'next/font/google';
import ThemeToggle from '@/components/theme-toggle';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _archivo = Archivo({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _workSans = Work_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      suppressHydrationWarning
      lang="en">
      <body className="p-4 font-body min-h-dvh flex flex-col">
        <Providers>
          <header>
            <ThemeToggle />
          </header>
          <main className="flex flex-col relative">{children}</main>
          <Loader />
          <footer className="flex w-full mt-5">
            <a
              className="mx-auto text-sm text-secondary italic text-center"
              href="https://logo.dev"
              title="Logo API">
              Company logos provided by Logo.dev
            </a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
