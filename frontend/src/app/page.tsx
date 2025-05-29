'use client';

import { useMemo } from 'react';
import { useCompanies } from '@/services/company/queries';
import Image from 'next/image';
import Carousel from '@/components/carousel';
import { useBrands } from '@/services/brand/queries';
import { useProducts } from '@/services/product/queries';
import Select from 'react-select';

export default function Home() {
  const { data } = useCompanies();
  const { data: brandData } = useBrands({});
  const { data: productData } = useProducts();

  const companyLogos = useMemo(() => {
    return data?.filter((x) => !!x.url) ?? [];
  }, [data]);
  const searchOptions = useMemo(
    () => [
      {
        label: 'Companies',
        options: data ?? [],
      },
      {
        label: 'Brands',
        options: brandData ?? [],
      },
      {
        label: 'Products',
        options: productData ?? [],
      },
    ],
    [data, brandData, productData],
  );

  const formatGroupLabel = (data: { label: string; options: unknown[] }) => (
    <div className="flex align-center justify-between">
      <span>{data.label}</span>
      <span>{data.options.length}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-center text-2xl">Boycotted Companies</h2>
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
      <div>
        <h2 className="text-center text-xl">Search</h2>
        <Select
          options={searchOptions}
          formatGroupLabel={formatGroupLabel}
          getOptionLabel={(option) => option.name}
        />
      </div>
    </div>
  );
}
