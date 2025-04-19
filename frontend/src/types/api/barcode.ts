import 'reflect-metadata';
import Product from '@/types/api/product';
import { Type } from 'class-transformer';

export default class Barcode {
  public id!: string;
  public code!: string;
  public productId!: string;
  @Type(() => Product)
  public product?: Product;
}
