import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';
import Image from 'next/image';
import { Work_Sans, Archivo } from 'next/font/google';

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
    <html lang="en">
      <body className="px-4 py-8 font-body">
        <Image
          className="w-128 mx-auto mb-4"
          src="/logo.png"
          alt="Logo"
          width={1526}
          height={600}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
