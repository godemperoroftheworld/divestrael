import { HttpStatusCode } from 'axios';
import { Company, Country } from '@prisma/client';
import { Brand } from '.prisma/client';

import { RouteHandler } from '@/helpers/route.helper';
import { CompanyGetParams, CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import AIService from '@/services/ai.service';
import prisma from '@/repositories/prisma.repository';
import KGService from '@/services/knowledgegraph.service';
import CorpwatchService from '@/services/corpwatch.service';
import { ERRORS } from '@/helpers/errors.helper';

function companyToResponse(company: Company & { brands: Brand[] }): CompanyResponse {
  const { name, description, image, source, reasons, brands, country } = company;
  return {
    name,
    description,
    brands: brands.map((brand) => brand.name),
    image: image ?? undefined,
    reasons: reasons ?? undefined,
    source: source ?? undefined,
    country,
  };
}

async function postCompanyInternal({
  name,
  reasons,
  source,
  country,
}: CompanyPostBody): Promise<CompanyResponse> {
  const company = await CorpwatchService.instance.findTopCompany(name);
  const matchingCompany = company
    ? await prisma.company.findFirst({
        where: { OR: [{ cw_id: company.cw_id }, { name }] },
        include: { brands: true },
      })
    : undefined;
  if (matchingCompany) {
    throw ERRORS.companyExists;
  }

  const description = await KGService.instance.getDescription(name);
  const brandNames = await AIService.instance.getBrands(name, country);
  const image = await KGService.instance.getImage(name);
  const result = await prisma.company.create({
    data: {
      name,
      description,
      reasons,
      source,
      image,
      cw_id: company?.cw_id,
      cik: company?.cik,
      country: country ?? company?.country_code ?? Country.US,
    },
  });
  if (brandNames.length) {
    await prisma.brand.createMany({
      data: brandNames.map((name) => ({
        name,
        companyId: result.id,
      })),
    });
  }
  return {
    name,
    description,
    image,
    reasons,
    source,
    brands: brandNames,
    country: result.country,
  };
}

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const company = req.body;
  const result = await postCompanyInternal(company);
  res.status(HttpStatusCode.Ok).send(result);
};

const postCompaniesHandler: RouteHandler<{
  Body: CompanyPostBody[];
  Reply: CompanyResponse[];
}> = async (req, res) => {
  const companies = req.body;
  const promises: Promise<CompanyResponse | null>[] = [];
  companies.forEach((company, index) => {
    const promise = new Promise<CompanyResponse | null>((resolve, reject) => {
      setTimeout(() => {
        postCompanyInternal(company)
          .then(resolve)
          .catch((err) => {
            if (err === ERRORS.companyExists) {
              resolve(null);
            } else {
              setTimeout(() => {
                postCompanyInternal(company).then(resolve).catch(reject);
              }, 2000);
            }
          });
      }, 250 * index);
    });
    promises.push(promise);
  });
  const response: CompanyResponse[] = (await Promise.all(promises)).filter((v) => !!v);
  res.status(HttpStatusCode.Ok).send(response);
};

const getCompanyHandler: RouteHandler<{
  Params: CompanyGetParams;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      brands: true,
    },
  });
  res.status(HttpStatusCode.Ok).send(companyToResponse(company));
};

export default {
  postCompanyHandler,
  postCompaniesHandler,
  getCompanyHandler,
};
