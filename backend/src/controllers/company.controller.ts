import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { CompanyPostBody, CompanyResponse } from '@/schemas/company.schema';
import AIService from '@/services/ai.service';
import prisma from '@/repositories/prisma.repository';
import LogoService from '@/services/logo.service';

const postCompanyHandler: RouteHandler<{
  Body: CompanyPostBody;
  Reply: CompanyResponse;
}> = async (req, res) => {
  const { name, description, boycott, reason, source } = req.body;
  const { names: brandNames } = await AIService.instance.getBrands(name);
  const image = await LogoService.instance.getImage(name);
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

export default {
  postCompanyHandler,
};
