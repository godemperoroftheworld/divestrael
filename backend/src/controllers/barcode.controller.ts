import { HttpStatusCode } from 'axios';

import BarcodeService from '@/services/barcode.service';
import AIService from '@/services/ai.service';
import CorpwatchService from '@/services/corpwatch.service';
import { BarcodeGetParams, BarcodeResponse } from '@/schemas/barcode.schema';
import { RouteHandler } from '@/helpers/route.helper';
import KGService from '@/services/knowledgegraph.service';
import CompanyService from '@/services/company.service';
import prisma from '@/repositories/prisma.repository';

const getBarcodeHandler: RouteHandler<{
  Params: BarcodeGetParams;
  Reply: BarcodeResponse;
}> = async (req, res) => {
  const { barcode } = req.params;
  // Get barcode information
  const product = await BarcodeService.instance.getBarcode(barcode);
  const { name } = await AIService.instance.getCompany(product.title, product.brand);
  const parentCompany = await CorpwatchService.instance.findTopCompany(name);
  // First check on central key index
  if (parentCompany?.cik) {
    const dbCompany = await CompanyService.instance.findCompanyByCIK(parentCompany.cik);
    if (dbCompany) {
      res.status(HttpStatusCode.Ok).send({
        barcode,
        title: product.title,
        brand: product.brand,
        company: dbCompany.name,
        reasons: dbCompany.reasons,
        source: dbCompany.source ?? undefined,
        boycott: !!dbCompany.reasons.length,
      });
      return;
    }
  }
  // Then check on company name
  const dbCompany = await CompanyService.instance.searchCompany(name);
  if (dbCompany) {
    // Populate CIK/ CW_ID if missing
    if (!dbCompany.cik && !dbCompany.cw_id && parentCompany?.cik && parentCompany?.cw_id) {
      await prisma.company.update({
        where: { name: dbCompany.name, cik: parentCompany.cik, cw_id: parentCompany.cw_id },
        data: { cik: parentCompany.cik, cw_id: parentCompany.cw_id },
      });
    }
    res.status(HttpStatusCode.Ok).send({
      barcode,
      title: product.title,
      brand: product.brand,
      company: dbCompany.name,
      boycott: !!dbCompany.reasons.length,
      reasons: dbCompany.reasons,
      source: dbCompany.source ?? undefined,
    });
    return;
  }
  // Otherwise we have no match
  const company = parentCompany?.company_name ?? name;
  const image = await KGService.instance.getImage(company);
  const result: BarcodeResponse = {
    barcode,
    title: product.title,
    brand: product.brand,
    company,
    image,
    boycott: false,
  };
  res.status(HttpStatusCode.Ok).send(result);
};

export default {
  getBarcodeHandler,
};
