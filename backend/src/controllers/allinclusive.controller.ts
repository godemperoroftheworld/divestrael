import { HttpStatusCode } from 'axios';

import { RouteHandler } from '@/helpers/route.helper';
import { AllInclusiveBarcode, AllInclusiveCompany } from '@/schemas/allinclusive.schema';
import CompanyService from '@/services/company.service';
import CorpwatchService from '@/services/corpwatch.service';
import AIService from '@/services/generator.service';
import companyMapper from '@/mappers/company.mapper';
import BrandService from '@/services/brand.service';
import { CompanyResponse } from '@/schemas/company.schema';
import { BarcodeResponse } from '@/schemas/barcode.schema';
import barcodeMapper from '@/mappers/barcode.mapper';
import BarcodeService from '@/services/barcode.service';
import ProductService from '@/services/product.service';

export const postCompany: RouteHandler<{
  Body: AllInclusiveCompany;
  Reply: { 200: CompanyResponse };
}> = async (req, res) => {
  const { country, name } = req.body;
  const matchingCompany = await CompanyService.instance.searchCompany(name);
  if (matchingCompany) {
    const response = companyMapper(matchingCompany);
    res.status(HttpStatusCode.Ok).send(response);
  } else {
    // Get extra company info
    const corpwatch = await CorpwatchService.instance.findTopCompany(name);
    const description = await AIService.instance.getDescription(name);
    const image = await AIService.instance.getImage(name);
    // Create company
    const company = await CompanyService.instance.createCompany({
      name: corpwatch?.company_name ?? name,
      description,
      image,
      country,
      cik: corpwatch?.cik ?? null,
      cw_id: corpwatch?.cw_id ?? null,
      reasons: [],
      source: null,
    });
    // Generate and create brands
    const generatedBrands = await AIService.instance.generateBrands(company.id);
    const brands = await BrandService.instance.createBrands(generatedBrands);
    const response = companyMapper({ ...company, brands });
    res.status(HttpStatusCode.Ok).send(response);
  }
};

export const postBarcode: RouteHandler<{
  Body: AllInclusiveBarcode;
  Reply: { 200: BarcodeResponse };
}> = async (req, res) => {
  const { code, name, brand: brandName } = req.body;

  // Early return -> barcode
  const matchingBarcode = await BarcodeService.instance.searchBarcode(code);
  if (matchingBarcode) {
    const response = barcodeMapper(matchingBarcode);
    res.status(HttpStatusCode.Ok).send(response);
    return;
  }

  // Early return -> product
  const matchingProduct = await ProductService.instance.searchProduct(name);
  if (matchingProduct) {
    const barcode = await BarcodeService.instance.createBarcode({
      code,
      productId: matchingProduct.id,
    });
    const response = barcodeMapper(barcode);
    res.status(HttpStatusCode.Ok).send(response);
    return;
  }

  // Get or create company
  const generatedCompany = await AIService.instance.generateCompany(name, brandName);
  let company = await CompanyService.instance.searchCompany(name);
  if (!company) {
    const corpwatch = await CorpwatchService.instance.findTopCompany(name);
    const internalCompany = await CompanyService.instance.createCompany({
      ...generatedCompany,
      name: corpwatch?.company_name ?? name,
      cw_id: corpwatch?.cw_id ?? null,
      cik: corpwatch?.cik ?? null,
    });
    const generatedBrands = await AIService.instance.generateBrands(internalCompany.id);
    const brands = await BrandService.instance.createBrands(generatedBrands);
    company = { ...internalCompany, brands };
  }

  // Find brand
  const brand = await BrandService.instance.searchBrand(brandName);
  // Create product
  const product = await ProductService.instance.createProduct({
    name,
    brandId: brand!.id,
  });
  // Create barcode
  const barcode = await BarcodeService.instance.createBarcode({
    code,
    productId: product.id,
  });
  const response = barcodeMapper(barcode);
  res.status(HttpStatusCode.Ok).send(response);
};

export default {
  postBarcode,
  postCompany,
};
