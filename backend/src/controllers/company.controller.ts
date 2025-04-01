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
import CompanyService from '@/services/company.service';

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const company = req.body;
  const result = await CompanyService.instance.createCompany(company);
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
        CompanyService.instance
          .createCompany(company)
          .then(resolve)
          .catch((err) => {
            if (err === ERRORS.companyExists) {
              resolve(null);
            } else {
              setTimeout(() => {
                CompanyService.instance.createCompany(company).then(resolve).catch(reject);
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
  const result = await CompanyService.instance.getCompany(id);
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  postCompanyHandler,
  postCompaniesHandler,
  getCompanyHandler,
};
