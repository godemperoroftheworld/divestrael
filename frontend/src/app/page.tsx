'use client';

import React, { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';
import Image from 'next/image';
import Carousel from '@/components/carousel';

export default function Home() {
  const { data } = useCompanies();

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <div className="font-heading font-bold text-xl text-center">
        Since{' '}
        <a
          href="https://en.wikipedia.org/wiki/Nakba"
          target="_blank"
          className="text-primary font-black hover:text-primary-400">
          December 31st, 1937
        </a>
        , the Israeli ethnostate has been carrying out a{' '}
        <a
          href="https://en.wikipedia.org/wiki/Palestinian_genocide_accusation"
          target="_blank"
          className="text-primary font-black hover:text-primary-400">
          genocide
        </a>{' '}
        against the Palestinian people.
        <br />
        The goal of this site is to provide a tool to divest from companies are
        actively contributing to the ongoing{' '}
        <a
          href="https://en.wikipedia.org/wiki/Palestinian_genocide_accusation"
          target="_blank"
          className="text-primary font-black hover:text-primary-400">
          genocide
        </a>
        .
      </div>
      <div>
        <h2 className="text-center text-xl font-black text-primary font-heading mb-2">
          Boycotted Companies
        </h2>
        <Carousel className="mx-auto overflow-hidden">
          {companyLogos.map((company) => (
            <div
              key={company.id}
              className="rounded-lg overflow-hidden">
              {company.url ? (
                <a
                  href={company.url}
                  target="_blank">
                  <Image
                    className="w-32 aspect-square"
                    src={company.image_url}
                    alt={company.name}
                    width={100}
                    height={100}
                  />
                </a>
              ) : (
                <Image
                  className="w-32 aspect-square"
                  src={company.image_url}
                  alt={company.name}
                  width={100}
                  height={100}
                />
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
