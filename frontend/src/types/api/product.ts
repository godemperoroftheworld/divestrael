import 'reflect-metadata';
import Brand from '@/types/api/brand';
import Barcode from '@/types/api/barcode';
import { Type } from 'class-transformer';

export default class Product {
  id!: string;
  name!: string;
  brandId!: string;
  @Type(() => Brand)
  brand?: Brand;
  @Type(() => Barcode)
  barcodes?: Barcode[];
}
