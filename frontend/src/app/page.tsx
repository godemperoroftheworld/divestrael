'use client';

import React, { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';
import Image from 'next/image';
import Carousel from '@/components/carousel';
import Search from '@/components/search';
import ConditionalLink from '@/components/conditional-link';
import Link from 'next/link';

export default function Home() {
  const { data } = useCompanies();

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);

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
        <Carousel className="mx-auto overflow-hidden">
          {companyLogos.map((company) => (
            <div
              key={company.id}
              className="rounded-lg overflow-hidden">
              <ConditionalLink
                href={company.url}
                target="_blank">
                <Image
                  className="w-32 aspect-square"
                  title={company.name}
                  src={company.image_url}
                  alt={company.name}
                  width={100}
                  height={100}
                />
              </ConditionalLink>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
