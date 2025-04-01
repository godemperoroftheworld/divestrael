import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { CompanyGetParams, CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import AIService from '@/services/ai.service';
import prisma from '@/repositories/prisma.repository';
import KGService from '@/services/knowledgegraph.service';

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const { name, boycott, reason, source } = req.body;
  const brandNames = await AIService.instance.getBrands(name);
  const image = await KGService.instance.getImage(name);
  const description = await KGService.instance.getDescription(name);
  const result = await prisma.company.create({
    data: {
      name,
      description,
      boycott,
      reason,
      source,
      image,
    },
  });
  await prisma.brand.createMany({
    data: brandNames.map((name) => ({
      name,
      companyId: result.id,
    })),
  });
  res.status(HttpStatusCode.Ok).send({
    name,
    description,
    boycott,
    image,
    reason,
    source,
    brands: brandNames,
  });
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
  const { name, boycott, description, image, source, reason, brands } = company;
  res.status(HttpStatusCode.Ok).send({
    name,
    description,
    brands: brands.map((brand) => brand.name),
    boycott,
    image: image ?? undefined,
    reason: reason ?? undefined,
    source: source ?? undefined,
  });
};

export default {
  postCompanyHandler,
  getCompanyHandler,
};
