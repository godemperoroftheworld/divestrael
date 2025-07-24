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
    <html
      lang="en"
      className="bg-white">
      <body className="px-4 py-8 font-body">
        <Link href="/">
          <Image
            className="w-128 mx-auto mb-4"
            src="/logo.png"
            alt="Logo"
            width={1526}
            height={600}
          />
        </Link>
        <Providers>
          <div className="flex flex-col gap-6 items-center w-full overflow-x-hidden relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
