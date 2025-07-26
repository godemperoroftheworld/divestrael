import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';
import Image from 'next/image';
import { Work_Sans, Archivo } from 'next/font/google';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Divestrael',
  description: 'A boycott, divestment, and sanctions tool',
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en"
        className="bg-background">
        <body className="p-4 pt-8 font-body min-h-dvh flex flex-col">
          <Link href="/">
            <Image
              className="w-128 mx-auto mb-4"
              src="/logo.png"
              priority={true}
              fetchPriority="high"
              alt="Logo"
              width={1526}
              height={600}
            />
          </Link>
          <div className="flex flex-col grow gap-4 items-center w-full overflow-x-hidden relative">
            <Providers>{children}</Providers>
          </div>
          <footer className="flex w-dvw">
            <a
              className="mx-auto text-sm text-secondary italic text-center"
              href="https://logo.dev"
              title="Logo API">
              Company logos provided by Logo.dev
            </a>
          </footer>
        </body>
      </html>
    </>
  );
}
