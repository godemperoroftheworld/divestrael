import React from 'react';
import Search from '@/components/home/search';
import Link from 'next/link';
import CompanyCarousel from '@/components/home/company-carousel';
import { CameraIcon } from '@heroicons/react/24/solid';
import Button from '@/components/ui/button';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <div className="font-heading font-bold sm:text-xl text-center">
        Since{' '}
        <Link
          href="https://en.wikipedia.org/wiki/Nakba"
          target="_blank"
          className="text-danger font-black hover:text-danger-600">
          December 31st, 1937
        </Link>
        , the Israeli ethnostate has been carrying out a{' '}
        <Link
          href="https://en.wikipedia.org/wiki/Palestinian_genocide_accusation"
          target="_blank"
          className="text-danger font-black hover:text-danger-600">
          genocide
        </Link>{' '}
        against the Palestinian people.
        <br />
        The goal of this site is to provide a tool to divest from companies are
        actively contributing to the ongoing{' '}
        <Link
          href="https://en.wikipedia.org/wiki/Palestinian_genocide_accusation"
          target="_blank"
          className="text-danger font-black hover:text-danger-600">
          genocide
        </Link>
        .
      </div>
      <div className="flex flex-col gap-2 items-center w-full">
        <h2 className="text-center text-xl font-black text-primary font-heading">
          Boycott Lookup
        </h2>
        <Search className="w-md shrink" />
        <span className="text-lg text-gray-500 font-black italic">OR</span>
        <Link
          className="max-w-full"
          href="/snap">
          <Button>
            <CameraIcon className="w-8" />
            Take a Picture
          </Button>
        </Link>
      </div>
      <div className="w-full">
        <h2 className="text-center text-xl font-black text-primary font-heading">
          List of Shame
        </h2>
        <p className="text-center mb-2">
          The following companies are boycotted. Click on them to learn more.
        </p>
        <CompanyCarousel />
      </div>
    </>
  );
}
