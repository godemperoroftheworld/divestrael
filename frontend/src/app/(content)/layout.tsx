import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Divestrael',
  description: 'A boycott, divestment, and sanctions tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Link href="/">
        <Image
          className="w-96 mx-auto mb-5"
          src="/logo.png"
          priority={true}
          fetchPriority="high"
          alt="Logo"
          width={1526}
          height={600}
        />
      </Link>
      <div className="flex flex-col grow gap-5 items-center w-full overflow-x-hidden relative">
        {children}
      </div>
    </>
  );
}
