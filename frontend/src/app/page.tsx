import React from 'react';
import Search from '@/components/home/search';
import Link from 'next/link';
import CompanyCarousel from '@/components/home/company-carousel';

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="font-heading font-bold text-xl text-center">
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
      <div>
        <h2 className="text-center text-xl font-black text-primary font-heading">
          Search for Something
        </h2>
        <p className="text-center mb-2">
          It can be a product, a brand, or a company. We&#39;ll tell you if you
          should boycott it.
        </p>
        <div className="max-w-2xl mx-auto">
          <Search />
        </div>
      </div>
      <div>
        <h2 className="text-center text-xl font-black text-primary font-heading">
          Boycotted Companies
        </h2>
        <p className="text-center mb-2">
          The following companies are boycotted. Click on them to learn more.
        </p>
        <CompanyCarousel />
      </div>
    </div>
  );
}
