import './globals.css';
import Providers from '@/components/providers';
import Loader from '@/components/loader';
import React, { PropsWithChildren } from 'react';
import { Work_Sans, Archivo } from 'next/font/google';

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
      lang="en"
      className="bg-background">
      <body className="p-4 pt-8 font-body min-h-dvh flex flex-col">
        <Providers>
          {children}
          <Loader />
        </Providers>
        <footer className="flex w-full mt-5">
          <a
            className="mx-auto text-sm text-secondary italic text-center"
            href="https://logo.dev"
            title="Logo API">
            Company logos provided by Logo.dev
          </a>
        </footer>
      </body>
    </html>
  );
}
